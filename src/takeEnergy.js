module.exports = function takeEnergy() {
    var creep = this;
    var energies = creep.room.find(FIND_MY_STRUCTURES, {
        filter: function(s){ return s.structureType == STRUCTURE_EXTENSION && s.energy > 0; }
    }).concat(creep.room.find(FIND_MY_CREEPS, {
        filter: function(c){ return ['harvester', 'cargo'].indexOf(c.memory.role) >= 0 && c.carry.energy > 0;}
    })).concat(
		creep.room.find(FIND_DROPPED_ENERGY)
	).concat(
		creep.room.find(FIND_MY_SPAWNS, {filter: function(s){return s.energy >= 50;} })
	);
    var e = creep.pos.findClosestByPath(energies);
    if (e){
        creep.moveTo(e);
        if (e.transferEnergy)
            e.transferEnergy(creep);
        else if (e.pickup)
            creep.pickup(e);
		else
			console.log("can't take energy from " + e);
        return true;
    }
    else
        return false;
}