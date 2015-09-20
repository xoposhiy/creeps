module.exports = function (creep) {
    if (creep.carry.energy < creep.carryCapacity){
        creep.moveTo(Game.flags['energy']);
        creep.room.lookAt(Game.flags.energy.pos).forEach(function(e){if (e.type=='source') creep.harvest(e.source); })
    }
    else{
		var spawn = _.values(Game.spawns)[0]; // TODO multispawn
        creep.moveTo(spawn);
        if (spawn.room == creep.room){
            creep.memory.role = 'harvester';
        }
    }
}