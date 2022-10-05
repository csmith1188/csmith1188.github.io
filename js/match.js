class Match {
    constructor() {
        this.map;
        this.npcs = [];
        this.goals = [];
        this.goalIndex = 0;
        this.laps = [];
        this.lapStart = 0;
        this.lapEnd = 0;
        this.blocks = []; // Different from map blocks. Think powerups and dropped items
    }
}