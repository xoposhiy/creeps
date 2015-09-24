module.exports = {
	waitTimeout: 10,

	/** @param {Creep} creep */
	fits: function(creep) {
		return creep.carry.energy < 10 &&
			creep.bodyScore([WORK, WORK, CARRY, MOVE]) > 0 && 
			getTarget(creep);
	},

	/** @param {Creep} creep */
	finished: creep => creep.carry.energy == creep.carryCapacity,

	/** @param {Creep} creep */
	run: function(creep) {
		var toLog = creep.room.name != "W12S28";
		if (toLog)
			console.log('harvester getTarget(' + creep + ')');
		var s = getTarget(creep);
		if (toLog)
			console.log("harvester to " + s);
		return creep.approachAndDo(s, () => creep.harvest(s), true);
	}	
};

/** @param {Creep} creep */
function getTarget(creep){
	return creep.pos.findClosestByPath(FIND_SOURCES, { filter: 
			s => (s.energy > 0 || s.ticksToRegeneration < 10) && s.pos.canAssign(creep)
		});
}
