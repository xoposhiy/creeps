module.exports = function (creep) {
    if (creep.carry.energy < creep.carryCapacity){
        creep.moveTo(Game.flags['energy']);
        creep.room.lookAt(Game.flags.energy.pos).forEach(function(e){if (e.type=='source') creep.harvest(e.source); })
    }
    else{
        creep.moveTo(Game.spawns.home);
        if (Game.spawns.home.room == creep.room){
            creep.memory.role = 'harvester';
        }
    }
}