module.exports = {
	fits: function(creep){
		return creep.carry.energy == creep.carryCapacity &&
			creep.room.controller.my &&
			creep.bodyScore([MOVE, CARRY, WORK]) > 0 && 
			!creep.room.isSpawningTime() &&
			getTarget(creep);
	},
	
	finished: function(creep){
		return creep.carry.energy == 0 || !creep.room.controller.my;
	},
	
	run: function(creep){
		var target = getTarget(creep);
		return creep.approachAndDo(target, () => creep.upgradeController(target));
	}
};

function getTarget(creep){
	return creep.room.controller.pos.canAssign(creep) ? creep.room.controller : undefined;
}