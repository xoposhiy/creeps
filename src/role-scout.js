module.exports = {
	fits: creep => 
		creep.bodyScore([WORK, CARRY, MOVE, MOVE]) && 
		creep.carry.energy == 0 &&
		Game.flags.energy,

	finished: creep => creep.carry.energy == creep.carryCapacity,

	run: function(creep) {
		var target = Game.flags.energy;
		return creep.approachAndDo(target, 
			() => _.some(creep.room.lookAt(target), e => e.type=='source' && creep.harvest(e.source) == OK));
	}	
};