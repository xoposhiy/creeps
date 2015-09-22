module.exports = {
	waitTimeout: 5,

	finished: function(creep){ return creep.carry.energy == creep.carryCapacity; },

	fits: function(creep){
		var bodyIsOk = _([MOVE, CARRY]).every(function(part){return creep.getActiveBodyparts(part) > 0;});
		var hasRoomForEnergy = creep.carry.energy < creep.carryCapacity;
		return bodyIsOk && hasRoomForEnergy;
	},

	run: function(creep){
		var s = creep.pos.findClosestByPath(findEnergySources(creep));
		return creep.approachAndDo(s, () => creep.takeEnergyFrom(s));
	}
};

function findEnergySources(creep){
	var mates = creep.room.find(FIND_MY_CREEPS, {filter: c =>  ['harvester', 'reservator', 'no', 'cargo'].indexOf(c.memory.role) >= 0 && c.carry.energy > 30});
	var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: s => s.getStoredEnergy() > 20});
	var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
	return mates.concat(storages).concat(droppedEnergy);
}
