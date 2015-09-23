module.exports = {
	
	waitTimeout: 10,
	
	fits: function(creep){
		return creep.carry.energy == creep.carryCapacity && 
			creep.bodyScore([MOVE, CARRY, WORK]) > 0 && 
			!creep.room.isSpawningTime() && 
			getTarget(creep);
	},
	
	finished: function(creep){
		return creep.carry.energy == 0;
	},
	
	run: function(creep){
		var target = getTarget(creep);
		return creep.approachAndDo(target, () => buildOrRepair(creep, target));
	}
};

function buildOrRepair(creep, structure){
	if (structure.progress !== undefined) //ConstructionSite
		return creep.build(structure);
	else //Structure
		return creep.repair(structure);
}

function getTarget(creep){
	var targets = creep.room.find(FIND_CONSTRUCTION_SITES).
		concat(creep.room.find(FIND_STRUCTURES, {filter: s => s.hits < s.hitsMax && s.pos.canAssign(creep)}));
	targets = _.sortBy(targets, t => scoreBuildTarget(creep, t));
	return targets[0];
}

function scoreBuildTarget(creep, t){
	var hits = t.hits || 0;
	var maxHits = Math.min(150000, t.hitsMax || 1) + 0.0;
	return t.pos.getRangeTo(creep.pos) + 100.0*hits / maxHits;
}