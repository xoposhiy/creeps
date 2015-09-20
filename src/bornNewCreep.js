var roles = require('roles');

var home = Game.spawns.home;

module.exports = function bornNewCreep(){
    //if (home.energy >= 200)
    {
        var imp = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK];
        var carrier = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
        var creepsByRole = getCreepsByRole();
        if (creepsByRole['harvester'].length < 2) createCreep([WORK, CARRY, MOVE], 'harvester');
        else if (creepsByRole['harvester'].length < 3 && creepsByRole['scout'].length < 3) createCreep(imp, 'harvester');
        else if (creepsByRole['upgrader'].length < 1) createCreep(imp, 'upgrader');
        else if (creepsByRole['cargo'].length + creepsByRole['hungry'].length < 3) createCreep(carrier, 'hungry');
        else if (creepsByRole['builder'].length + creepsByRole['hungry'].length < 3) createCreep(imp, 'builder');
        else if (creepsByRole['scout'].length < 6) createCreep(imp, 'scout');
        else if (creepsByRole['guard'].length < 2) createCreep([MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK], 'guard');
        // else
        // {
        //     console.log('nothing to create');
        // }
    }
}

function createCreep(bodyParts, role){
    var created = home.createCreep(bodyParts, role[0] + Game.time, {role: role});
    if (Game.time % 10 == 0 || typeof created !== "number")
        console.log("creating " + role + ": " + created);
}

function getCreepsByRole(){
    var creepsByRole = {};
    for(var role in roles)
        creepsByRole[role] = [];
    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        if (!creepsByRole[creep.memory.role])
            console.log(creep + " with role " + creep.memory.role);
        else
            creepsByRole[creep.memory.role].push(creep);
    }
    return creepsByRole;
}

Creep.prototype.getCreepsByRole = getCreepsByRole;
Creep.prototype.getMates = function(){
    return this.getCreepsByRole()[this.memory.role];
};