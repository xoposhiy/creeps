// Берет где-то энергию

module.exports = {
    waitTimeout: 20,

    finished: function(creep){ return creep.carry.energy == creep.carryCapacity; },

    fits: function(creep){
        var bodyIsOk = _([MOVE, CARRY]).every(function(part){return creep.getActiveBodyparts(part) > 0;});
        var hasRoomForEnergy = creep.carry.energy < creep.carryCapacity;
        return bodyIsOk && hasRoomForEnergy;
    },

	run: function(creep){
		var s = creep.pos.findClosestByPath(findEnergySources(creep));
		if (!s) return false;
		creep.moveTo(s.pos);
		if (s.transferEnergy)
			s.transferEnergy(creep);
		else creep.pickup(s);
		return true;
	}
}
 
function findEnergySources(creep){
    var mates = creep.room.find(FIND_MY_CREEPS, {filter: function(c){return ['harvester'].indexOf(c.memory.role) >= 0 && c.carry.energy > 30;}});
    var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: function(s){ return s.energy > 20; }});
    var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
    return mates.concat(storages).concat(droppedEnergy);
}
