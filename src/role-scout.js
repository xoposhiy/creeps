module.exports = {
	/** @param {Creep} creep */
	fits: creep =>
		creep.carry.energy == 0 && creep.ticksToLive > 200 &&
		creep.bodyScore([WORK, CARRY, MOVE, MOVE]),

	/** @param {Creep} creep */
	finished: creep => creep.memory.done,

	/** @param {Creep} creep */
	run: function(creep) {
		var target = getTarget(creep);
		return creep.approachAndDo(target, 
			() => exitRoom(creep, target), true);
	}	
};

/**
 * @param {Creep} creep
 * @returns {RoomPosition}
 * */
function getTarget(creep){
	return creep.pos.findClosestByPath(FIND_EXIT_TOP, {filter: pos => pos.canAssign(creep)});  //TODO fix!
}

/**
 * @param {Creep} creep
 * @param {RoomPosition} exit
 */
function exitRoom(creep, exit){
	if (creep.moveTo(exit) == OK)
		creep.memory.done = true;
}