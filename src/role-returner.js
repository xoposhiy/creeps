module.exports = {
	/** @param {Creep} creep */
	fits: creep => !creep.room.controller.my && creep.bodyScore([MOVE]) > 0,

	/** @param {Creep} creep */
	finished: creep => creep.room.controller.my,

	/** @param {Creep} creep */
	run: function(creep) {
		var s = creep.pos.findClosestByPath(FIND_EXIT_BOTTOM); //TODO fix!
		return creep.approachAndDo(s, () => creep.moveTo(s));
	}

};