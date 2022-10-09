Core Design Concept:
Space elves believe nothing is random:
    No RNG in the mechanics. Main play mode can be reliably speedran.
Dark elves believe everything is random:
    The mechanics should be so fun that players will make their
    own games in completely randomly generated maps and scenarios.

- moving block (can be used for camera controller)
    - linear or jetbike physics
    - can progress through camera blocks like goals
    - hitting camera block goals can change the speed of the moving block

- a function block that runs any function you give it when touched by anything that passes the filter

- FIX NPC vs PLAYER COLLISION PHYSICS!
- All menus should be blocks you must drive into in a small map
- get viewport of player and don't draw anything outside of it
- smaller hitboxes, bigger graphics
- flying in formation (if within 100: in formation. seek proximity to someone in formation)
- clean up and unify blocks
- shouldn't EVERYTHING be blocks? and players jsut have extra stuff?
- leaves/debris
	-- only spawn near player and despawn?
	-- better physics
    -- Better early-game coverage
- sonic boom effects (breaking the sound barrier / max speed)
- waves should affect like wind, updraft by z proximity
- airborn tricks al a waverace64
- shadows under sprites
- global lighting
- animators
- braking causes updraft nearby by leaving a block that only blows debris upwards
- rear engines should push things away
- particle block
- sounds at a distance
- threat system
- threat personalities
- behaviors (target heal pad when low, etc.)
- map/bg parralax (ascending/descending/speeding levels)
- obstacle avoidance (after weapons)
- touch controls
- raytrace a sword
- raytrace a curve https://www.geeksforgeeks.org/draw-circle-without-floating-point-arithmetic/
// AI
// Slow down overall speed if many obstructions in region
// Scan for objects that get closer
// Brake and Strafe away from obstacles while chasing
// Boost or shoot if you can draw a straight line with no collision