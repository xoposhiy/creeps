module.exports = {
	fits: function(creep){
		return creep.bodyScore([MOVE, CARRY, WORK]) > 0 && 
			creep.carry.energy == creep.carryCapacity &&
			creep.room.controller.my;
	},
	
	finished: function(creep){
		return creep.carry.energy == 0 || !creep.room.controller.my;
	},
	
	run: function(creep){
		var target = creep.room.controller;
		return creep.approachAndDo(target, () => creep.upgradeController(target));
	}
};