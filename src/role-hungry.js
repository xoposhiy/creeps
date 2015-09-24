module.exports = {
	waitTimeout: 5,

	/** @param {Creep} creep */
	finished: function(creep){
		return creep.carry.energy == creep.carryCapacity || creep.room.isSpawningTime(); 
	},

	/** @param {Creep} creep */
	fits: function(creep){
		return creep.carry.energy == 0 && 
			creep.bodyScore([MOVE, CARRY]) > 0 && 
			!creep.room.isSpawningTime();
	},

	/** @param {Creep} creep */
	run: function(creep){
		var s = creep.pos.findClosestByPath(findEnergySources(creep));
		return creep.approachAndDo(s, () => creep.takeEnergyFrom(s));
	}
};

/** @param {Creep} creep */
function findEnergySources(creep){
	var mates = creep.room.find(FIND_MY_CREEPS,
		{filter: c =>  ['harvester', 'reservator', 'no', 'cargo', 'scout'].indexOf(c.memory.role) >= 0 && c.carry.energy > 30});
	var storages = creep.room.find(FIND_MY_STRUCTURES, {filter: s => s.getStoredEnergy() > 20});
	var droppedEnergy = creep.room.find(FIND_DROPPED_ENERGY);
	return mates.concat(storages).concat(droppedEnergy);
}