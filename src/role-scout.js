module.exports = {
	fits: creep => 
		Game.flags.energy &&
		creep.carry.energy == 0 && creep.ticksToLive > 200 &&
		creep.bodyScore([WORK, CARRY, MOVE, MOVE]),

	finished: creep => creep.carry.energy == creep.carryCapacity,

	run: function(creep) {
		var target = Game.flags.energy;
		return creep.approachAndDo(target, 
			() => _.some(creep.room.lookAt(target), e => e.type=='source' && creep.harvest(e.source) == OK));
	}	
};