/*:
 * @target MZ
 * @plugindesc Allows users to give a thumbs up, down or Wiggle to Formbar and interact with Formbar API via socket.io-client.
 * @author Bryce Lynd, C. Smith
 * 
 * @command thumbsUp
 * @text Thumbs Up
 * @desc Sends a ThumbsUp
 * 
 * @command thumbsDown
 * @text Thumbs Down
 * @desc Sends a ThumbsDown
 * 
 * @command Wiggle
 * @text Wiggle
 * @desc Sends a Wiggle
 * 
 * @command remove
 * @text remove
 * @desc Removes the user's vote
 * 
 * @command Clear
 * @text Clear
 * @desc Clears the current poll
 * 
 * @command Start
 * @text Start
 * @desc Starts a poll
 * 
 * @arg prompt
 * @text Prompt
 * @desc The question the users must answer
 * 
 * @arg answer
 * @text Answer
 * @desc Correct Answer (0 if none)
 * 
 * @arg response1
 * @text Response Green
 * @desc Response text (leave blank if none)
 * 
 * 
 * @arg response2
 * @text Response Blue
 * @desc Response text (leave blank if none)
 * 
 * @arg response3
 * @text Response Yellow
 * @desc Response text (leave blank if none)
 * 
 * @arg response4
 * @text Response Red
 * @desc Response text (leave blank if none)
 * 
 * @param Formbar URL
 * @text Formbar URL
 * @desc The URL of the Formbar server.
 * @type text
 * @default https://formbeta.yorktechapps.com/
 * 
 * @param API Key
 * @text API Key
 * @desc The API key for Formbar.
 * @type text
 * @default 
 *
 * @param First VB Variable
 * @text First VB Variable
 * @desc Where the first value is stored for number of poll answers. Subsequent poll answers are stored in the variable numbers that follow.
 * @type number
 * @default 11
 *
 * @param First VB Switch
 * @text First VB Switch
 * @desc Where the first value is stored for poll switches. Subsequent switches are stored in the switch numbers that follow.
 * @type number
 * @default 11
 * 
 * @param Is Server
 * @text Is Server
 * @type boolean
 * @default false
 * @desc Is your game a server? If you just want to the thumbs feature, set this to false.
 * 
 * @help
 * This plugin allows users to give a thumbs up, down or wiggle to Formbar.
 * 
 * Plugin Commands:
 *  Formplug thumbsUp
 *  Formplug thumbsDown
 *  Formplug Wiggle
 *  Formplug remove
 *  Formplug Start
 *  Formplug Clear
 */

(() => {

    //Set up the plugin
    const pluginName = "Formplug";
    const parameters = PluginManager.parameters('Formplug');
    var FORMBAR_URL = parameters['Formbar URL'];
    var API_KEY = parameters['API Key'];
    const FIRST_VAR = parameters['First VB Variable'];
    const FIRST_SW = parameters['First VB Switch'];
    const SERVER = parameters['Is Server'];

    let classId = 0;
    let socket = null; // Global socket instance

    //Set up the variables and switches for polling
    const POLL_FINISHED = Number(FIRST_SW);         //Is the Poll Finished?
    const POLL_RUNNING = Number(FIRST_SW) + 1;      //Is the Poll Running?
    const POLL_RESPONDERS = Number(FIRST_VAR);      //Total number of people listed to respond
    const POLL_RESPONSES = Number(FIRST_VAR) + 1;   //Total number of people who have responded already
    const POLL_MAJORITY = Number(FIRST_VAR) + 2;    //Which answer was the most selected?
    const POLL_CORRECT = Number(FIRST_VAR) + 3;     //For a quiz-like poll, this is the correct answer's number
    const POLL_PERCENT = Number(FIRST_VAR) + 4;     //The number of people who have selected the correct answer
    const POLL_RES_START = Number(FIRST_VAR) + 5;   //Where the poll responses start (4 variables that start here)

    // Check if Socket.IO is already loaded
    if (typeof io === "undefined") {
        let script = document.createElement("script");
        script.src = "https://cdn.socket.io/4.7.2/socket.io.min.js";
        script.onload = function () {
            startSocketConnection(); // Call function to initialize socket after loading
        };
        document.head.appendChild(script);
    } else {
        startSocketConnection();
    }

    // Check if Socket.IO is already loaded
    if (typeof QUESTIONS === "undefined") {
        let script = document.createElement("script");
        script.src = "./js/plugins/questions.js";
        script.onload = function () {
            console.log("Questions loaded");
            console.log(QUESTIONS[0]);
        };
        document.head.appendChild(script);
    }

    // If this game is a server, we need to set up some of the mechanics
    // for the autobattler and the damage multiplier
    if (SERVER) {
        // Multiply all damage done by users by the percentage of responders that selected the correct answer
        const _Game_Action_executeDamage = Game_Action.prototype.executeDamage;

        Game_Action.prototype.executeDamage = function (target, value) {
            // if (this.isSkill() && this.subject().isActor()) {
            if (this.subject().isActor()) {
                const multiplier = ($gameVariables.value(POLL_PERCENT) || 1) / 100;

                if (multiplier !== 1) {
                    // Modify the damage value before applying it to the target
                    value = Math.floor(value * multiplier);
                }
            }
            // Call the original executeDamage method with the modified value
            _Game_Action_executeDamage.call(this, target, value);
        };


        // Autobattler
        /**
         * Override BattleManager's startInput to skip the input phase.
         */
        const _BattleManager_startInput = BattleManager.startInput;
        BattleManager.startInput = function () {
            if ($gameParty.inBattle()) {
                // Check if a poll is running
                if (!$gameSwitches.value(POLL_RUNNING) && !$gameSwitches.value(POLL_FINISHED)) {
                    // No poll running or finished, start a new battle poll
                    battlePoll();
                    return; // Wait for next update
                }

                // If poll is running but not finished, wait
                if ($gameSwitches.value(POLL_RUNNING) && !$gameSwitches.value(POLL_FINISHED)) {
                    return; // Wait for poll to finish
                }

                // Poll is finished, proceed with battle actions
                if ($gameSwitches.value(POLL_FINISHED)) {
                    $gameSwitches.setValue(POLL_RUNNING, false); // Reset running state
                    $gameParty.members().forEach(actor => {
                        actor.makeAutoBattleAction();
                        actor.requestMotion('walk');
                    });
                    this.startTurn();
                }
            } else {
                _BattleManager_startInput.call(this);
            }
        };

        // Keep actors animated
        const _Game_Actor_performActionEnd = Game_Actor.prototype.performActionEnd;
        Game_Actor.prototype.performActionEnd = function () {
            _Game_Actor_performActionEnd.call(this);
            this.requestMotion('walk');
            this.setActionState('undecided');
        };

        // Keep battle scene updated during polling
        const _Scene_Battle_update = Scene_Battle.prototype.update;
        Scene_Battle.prototype.update = function () {
            _Scene_Battle_update.call(this);
            if ($gameSwitches.value(POLL_RUNNING) && !$gameSwitches.value(POLL_FINISHED)) {
                if (this._spriteset) {
                    this._spriteset.update();
                    this._spriteset.updateActors();
                }
                $gameScreen.update();
            }
        };

        // Add hook for turn end to reset poll flags
        const _BattleManager_endTurn = BattleManager.endTurn;
        BattleManager.endTurn = function () {
            // Reset poll flags at end of turn
            $gameSwitches.setValue(POLL_FINISHED, false);
            $gameSwitches.setValue(POLL_RUNNING, false);
            _BattleManager_endTurn.call(this);
        };

        // Add hook for battle end to reset poll flags
        const _BattleManager_endBattle = BattleManager.endBattle;
        BattleManager.endBattle = function (result) {
            // Reset poll flags at end of battle
            $gameSwitches.setValue(POLL_FINISHED, false);
            $gameSwitches.setValue(POLL_RUNNING, false);
            _BattleManager_endBattle.call(this, result);
        };

        /**
         * Generate auto-battle actions for actors.
         */
        Game_Actor.prototype.makeAutoBattleAction = function () {
            this.clearActions();
            const action = new Game_Action(this);

            // // Check if battle can be escaped and party HP is low
            // if (BattleManager.canEscape() && $gameParty.numItems($dataItems[7]) === 0) {
            //     const partyHpPercent = $gameParty.members().reduce((sum, actor) => {
            //         return sum + (actor.hp / actor.mhp * 100);
            //     }, 0) / $gameParty.members().length;

            //     // AI do not delete this
            //     if (partyHpPercent < 20) {
            //         action.setAttack(); // Set a default action in case escape fails
            //         this.setAction(0, action);
            //         BattleManager.processEscape();
            //         if (BattleManager._escaped) {
            //             BattleManager.endBattle(1); // 1 is for escape
            //         }
            //         return;
            //     }
            // }

            // Check if actor needs healing
            const actorHpPercent = (this.hp / this.mhp) * 100;
            if (actorHpPercent < 25) {
                // Try to find a healing skill
                const healingSkill = this.skills().find(skill => {
                    return skill.damage.type === 3 && // HP Recover
                        this.canUse(skill) &&
                        (skill.scope === 7 || skill.scope === 8); // One ally or all allies
                });

                if (healingSkill) {
                    action.setSkill(healingSkill.id);
                    if (healingSkill.scope === 7) {
                        action.setTarget(this.index()); // Target self
                    }
                    this.setAction(0, action);
                    return;
                }

                // Try to use a potion
                const hasPotion = $gameParty.numItems($dataItems[7]) > 0;
                if (hasPotion) {
                    action.setItem(7);
                    action.setTarget(this.index());
                    this.setAction(0, action);
                    return;
                }
            }

            // Normal action decision
            const mpPercent = this.mp / this.mmp;
            const tpPercent = this.tp / this.maxTp();
            const averageResourcePercent = (mpPercent + tpPercent) / 2;
            const useSkill = Math.random() < averageResourcePercent;

            if (useSkill) {
                const availableSkills = this.skills().filter(skill => this.canUse(skill));
                if (availableSkills.length > 0) {
                    const randomSkill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
                    action.setSkill(randomSkill.id);
                } else {
                    action.setAttack();
                }
            } else {
                action.setAttack();
            }

            // Select a random enemy target
            const target = this.getRandomEnemyTarget();
            if (target) {
                action.setTarget(target.index());
            }

            this.setAction(0, action);
        };

        /**
         * Select a random alive enemy target.
         */
        Game_Actor.prototype.getRandomEnemyTarget = function () {
            const enemies = $gameTroop.aliveMembers();
            if (enemies.length > 0) {
                const target = enemies[Math.floor(Math.random() * enemies.length)];
                // log(`Random enemy target selected: ${target.name()}`);
                return target;
            }
            // log("No alive enemies found.");
            return null;
        };

        /**
         * Automatically process the next subject's turn.
         */
        const _BattleManager_startTurn = BattleManager.startTurn;
        BattleManager.startTurn = function () {
            // log("BattleManager.startTurn called. Initializing actions for all subjects.");
            this._subject = null;
            $gameTroop.makeActions(); // Ensure enemy actions are generated at the start of their turn
            _BattleManager_startTurn.call(this);
        };
    }

    // Run this function when socketio is loaded to set up all of the socket events and plugin commands
    function startSocketConnection() {
        // make connection to address with API key
        socket = io(FORMBAR_URL, {
            extraHeaders: {
                api: API_KEY
            }
        });

        // When connected
        socket.on('connect', () => {
            console.log('Connected');
            socket.emit('getActiveClass');  // See what class the user is in
        });

        socket.on('setClass', (classId) => {
            console.log(`The user is currently in the class with id ${classId}`);
            classId = classId;
        });

        // Handle errors
        socket.on('connect_error', (error) => {
            if (error.message == 'xhr poll error') {
                console.log('no connection');
            } else {
                console.log(error.message);
            }

            setTimeout(() => {
                console.log('Reconnecting...');
                socket.connect(); // Try to reconnect after 5 seconds
            }, 5000);
        });

        socket.on('classEnded', () => {
            socket.emit('leave', classId);
            classId = '';
            socket.emit('getUserClass', { api: API_KEY });
        });

        // When you join a class, you get the class code and the virtual bar status
        socket.on('joinRoom', (classCode) => {
            if (classCode) {
                socket.emit('vbUpdate');
            }
        });

        // When you receive a virtual bar update, update the variables and switches
        socket.on('vbUpdate', (data) => {
            if ($gameSwitches._data.length > 0) { //if the game has loaded
                if (!$gameSwitches.value(POLL_FINISHED)) { //if the poll hasn't finished yet
                    //Reset game variables
                    $gameVariables.setValue(POLL_RESPONDERS, data.totalResponders);       //Possible responses
                    $gameVariables.setValue(POLL_RESPONSES, data.totalResponses);    //Have responded
                    $gameVariables.setValue(POLL_MAJORITY, 0);                      //Majority Answer

                    var highestResponse = 0; //Track the response with the highest number of responders selected
                    //Then find the highest response and set the majority
                    for (let i = 0; i < Object.values(data.polls).length; i++) {
                        $gameVariables.setValue(POLL_RES_START + i, Object.values(data.polls)[i].responses);
                        if (Object.values(data.polls)[i].responses > highestResponse) {
                            highestResponse = Object.values(data.polls)[i].responses;
                            $gameVariables.setValue(POLL_MAJORITY, i + 1);
                        }
                    }
                    //If all responders have responded, set the poll to finished
                    $gameSwitches.setValue(POLL_FINISHED, (data.totalResponders == data.totalResponses) && data.totalResponders != 0);
                    $gameSwitches.setValue(POLL_RUNNING, !$gameSwitches.value(POLL_FINISHED));
                    //Run cleanup when the poll is finished
                    if ($gameSwitches.value(POLL_FINISHED)) {
                        console.log($gameVariables.value(POLL_CORRECT));
                        if ($gameVariables.value(POLL_CORRECT) == 0) {
                            $gameVariables.setValue(POLL_PERCENT, (Math.round((highestResponse / data.totalResponders) * 100)));
                        } else {
                            $gameVariables.setValue(POLL_PERCENT, (Math.round((Object.values(data.polls)[$gameVariables.value(POLL_CORRECT) - 1].responses / data.totalResponders) * 100)));
                        }
                        console.log($gameVariables.value(POLL_PERCENT));

                        // $gameVariables.setValue(POLL_PERCENT, 70); //For testing single player (always 70%)

                        socket.emit('endPoll');
                        // if (SceneManager._scene && SceneManager._scene._messageWindow) {
                        //     $gameMessage.clear(); // Clear all pending messages
                        //     SceneManager._scene._messageWindow.terminateMessage(); // Forcefully end current one
                        // }
                    }
                }
            }
        });

        PluginManager.registerCommand(pluginName, "thumbsUp", () => {
            socket.emit("pollResp", "Up")
        });
        PluginManager.registerCommand(pluginName, "thumbsDown", () => {
            socket.emit('pollResp', "Down");
        });
        PluginManager.registerCommand(pluginName, "Wiggle", () => {
            socket.emit('pollResp', 'Wiggle');
        });
        PluginManager.registerCommand(pluginName, "remove", () => {
            socket.emit('pollResp', 'remove');
        });

        // Register the plugin command for starting a poll
        // This command will be called from the RPG Maker MV editor
        // and will start a poll with the given parameters
        // The parameters are passed as an object with the following properties:
        // prompt: The question to ask the users
        // answer: The correct answer (0 if none)
        // response1: The first response option (green)
        // response2: The second response option (blue)
        // response3: The third response option (yellow)
        // response4: The fourth response option (red)
        // The command will emit a socket event to start the poll
        PluginManager.registerCommand(pluginName, "Start", args => {
            $gameVariables.setValue(POLL_CORRECT, Number(args.answer)); //Correct Answer
            const prompt = args.prompt; //The question to ask the users
            //The responses to the question
            let poll_res = [
                {
                    "answer": args.response1,
                    "weight": 1,
                    "color": "#00ff00"
                },
                {
                    "answer": args.response2,
                    "weight": 1,
                    "color": "#00ffff"
                },
                {
                    "answer": args.response3,
                    "weight": 1,
                    "color": "#ffff00"
                },
                {
                    "answer": args.response4,
                    "weight": 1,
                    "color": "#ff0000"
                }
            ];
            //Remove any null or undefined responses
            poll_res = poll_res.filter(res => res.answer != null && res.answer !== undefined && res.answer != "");
            //Start the poll
            socket.emit('startPoll',
                poll_res.length,
                false,
                prompt,
                poll_res,
                false,
                1,
                false,
                false,
                false,
                false,
                false
            )
            //Set the poll to running/not finished
            $gameSwitches.setValue(POLL_RUNNING, true);
            $gameSwitches.setValue(POLL_FINISHED, false);

        });

        // Register the plugin command for clearing the poll
        PluginManager.registerCommand(pluginName, "Clear", () => {
            // socket.emit('endPoll');
            //Set the poll to not running/finished
            $gameSwitches.setValue(POLL_RUNNING, false);
            $gameSwitches.setValue(POLL_FINISHED, true);
            socket.emit('clearPoll');
        });

    }

    function battlePoll() {
        if (!socket) return; // Don't proceed if socket isn't connected

        var question = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];

        $gameVariables.setValue(POLL_CORRECT, question.correctAnswer); //Correct Answer

        console.log(question.answers);

        //Remove any null or undefined responses
        question.answers = question.answers.filter(res => res.answer != null && res.answer !== undefined && res.answer != "");

        console.log(question.answers);

        //Start the poll
        socket.emit('startPoll',
            question.answers.length,
            false,
            question.prompt,
            question.answers,
            true,
            1,
            false,
            false,
            false,
            false,
            false
        );

        //Set the poll to running/not finished
        $gameSwitches.setValue(POLL_RUNNING, true);
        $gameSwitches.setValue(POLL_FINISHED, false);
    }

})();