module.exports = {
    fits: function(creep){
        var bodyIsOk = _([MOVE, CARRY, WORK]).every(function(part){return creep.getActiveBodyparts(part) > 0;});
        var fullOfEnergy = creep.carry.energy == creep.carryCapacity;
        return bodyIsOk && fullOfEnergy;
    },
    
    finished: function(creep){
        return creep.carry.energy == 0;
    },
    
    run: function(creep){
	    return creep.moveTo(creep.room.controller) == OK | creep.upgradeController(creep.room.controller) == OK;
    }
}