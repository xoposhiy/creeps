module.exports = {
	fits: creep => creep.bodyScore([WORK, WORK, CARRY, MOVE]) && creep.carry.energy < 10,

	finished: creep => creep.carry.energy == creep.carryCapacity,

	run: function(creep) {
		var s = creep.pos.findClosestByPath(FIND_SOURCES);
		return creep.approachAndDo(s, () => creep.harvest(s));
	}	
};
