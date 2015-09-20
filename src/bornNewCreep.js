var roles = require('roles');

module.exports = function bornNewCreep(){
    var smallImp = [WORK, CARRY, MOVE];
    var imp = [WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, CARRY, MOVE, WORK, MOVE];
    var creepsByRole = getCreepsByRole();
    createCreep(creepsByRole['harvester'].length < 2 ? smallImp : imp);
}

function createCreep(bodyParts){
    var spawn = _.values(Game.spawns)[0];
	spawn.createCreep(bodyParts, 'c' + bodyParts.length + '_' + Game.time, {role: 'no'});
}

function getCreepsByRole(){
    var creepsByRole = {};
    for(var role in roles)
        creepsByRole[role] = [];
    for(var name in Game.creeps){
        var creep = Game.creeps[name];
        if (!creepsByRole[creep.memory.role])
            creep.memory.role = "no";
        else
            creepsByRole[creep.memory.role].push(creep);
    }
    return creepsByRole;
}

Creep.prototype.getCreepsByRole = getCreepsByRole;
Creep.prototype.getMates = function(){
    return this.getCreepsByRole()[this.memory.role];
};