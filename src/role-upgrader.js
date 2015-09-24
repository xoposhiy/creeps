module.exports = {
	/** @param {Creep} creep */
	fits: function(creep){
		return creep.carry.energy == creep.carryCapacity &&
			creep.room.controller.my &&
			creep.bodyScore([MOVE, CARRY, WORK]) > 0 && 
			!creep.room.isSpawningTime() &&
			getTarget(creep);
	},

	/** @param {Creep} creep */
	finished: function(creep){
		return creep.carry.energy == 0 || !creep.room.controller.my;
	},

	/** @param {Creep} creep */
	run: function(creep){
		var target = getTarget(creep);
		return creep.approachAndDo(target, () => creep.upgradeController(target));
	}
};

/** @param {Creep} creep */
function getTarget(creep){
	return creep.room.controller.pos.canAssign(creep) ? creep.room.controller : undefined;
}