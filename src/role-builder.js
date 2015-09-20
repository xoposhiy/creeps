 module.exports = {
    
    waitTimeout: 10,
    
    fits: function(creep){
        var bodyIsOk = _([MOVE, CARRY, WORK]).every(function(part){return creep.getActiveBodyparts(part) > 0;});
        var fullOfEnergy = creep.carry.energy == creep.carryCapacity;
        return bodyIsOk && fullOfEnergy;
    },
    
    finished: function(creep){
        return creep.carry.energy == 0;
    },
    
    run: function(creep){
        if (creep.carry.energy == 0) return false;
	    var targets = creep.room.find(FIND_CONSTRUCTION_SITES).concat(creep.room.find(FIND_STRUCTURES, {filter: function(s) { return s.hits < s.hitsMax;}}));
	    targets = _.sortBy(targets, function(t) {return t.pos.getRangeTo(creep.pos) + 100*(t.hits || 0) / (0.0 + Math.min(150000, t.hitsMax || 1));});
		if(targets.length) {
		    var t = targets[0];
			creep.moveTo(targets[0]);
			if (targets[0].progress !== undefined) //ConstructionSite
			    creep.build(targets[0]);
			else //Structure
			    creep.repair(targets[0]);
			return true;
		}
		else
		    return false;

    }
 }