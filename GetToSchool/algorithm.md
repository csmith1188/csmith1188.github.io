- If the battle can be escaped, Calculate the average percent of remaining HP of all actors in the party
- - If the average is below 20%, and their are no Potions (id 7) left, attempt to escape
- Otherwise, if the actor is below 25% health
- - If the actor has a skill whose damage type is HP Recover that can target one or all allies and can use it
- - - Use that skill on the actor or party
- - otherwise, if there is a Potion (id 7) in the inventory, use it on the actor
- Otherwise, if the actor is below 25% MP and there is a Magic Water (id 10) in the inventory, use it on the actor
- Otherwise, if the actor has a skill available
- - Calculate the average of percent of remaining MP and percent of remaining TP
- - Generate a random number between 0 and 1
- - If that number is less than the average MP/TP, use a skill
- - otherwise, use a normal attack
