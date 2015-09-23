module.exports = {
	waitTimeout: 10,

	fits: function(creep) {
		return creep.carry.energy < 10 &&
			creep.bodyScore([WORK, WORK, CARRY, MOVE]) > 0 && 
			getTarget(creep);
	},

	finished: creep => creep.carry.energy == creep.carryCapacity,

	run: function(creep) {
		var s = getTarget(creep);
		return creep.approachAndDo(s, () => creep.harvest(s));
	}	
};

function getTarget(creep){
	return creep.pos.findClosestByPath(FIND_SOURCES, { filter: 
			s => (s.energy > 0 || s.ticksToRegeneration < 10) && s.pos.canAssign(creep)
		});
}
