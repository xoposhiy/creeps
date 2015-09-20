module.exports = {
    waitTimeout: 25,
    finished: function(creep) { return creep.carry.energy < 20; },

    fits: function(creep){
        var bodyIsOk = _([MOVE, CARRY]).every(function(part){return creep.getActiveBodyparts(part) > 0;});
        var fullOfEnergy = creep.carry.energy == creep.carryCapacity;
        return bodyIsOk && fullOfEnergy;
    },
    
    run: function(creep){
        var sinks = findEnergySinks(creep);
        if (sinks.length == 0) {
            var t = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (t.length) {
                var index = Math.floor(Game.time / 20) % t.length;
                creep.say(index);
                creep.moveTo(t[index].pos);
            }
            return false;
        }
        var s = creep.pos.findClosestByPath(sinks);
        creep.moveTo(s.pos);
        creep.transferEnergy(s);
        return true;
    }
}
 
 
function findEnergySinks(creep){
    return creep.room.find(FIND_MY_CREEPS, {filter: function(c){return ['builder', 'upgrader', 'hungry'].indexOf(c.memory.role) >= 0 && c.carry.energy < c.carryCapacity - 50 && c.getActiveBodyparts(WORK) > 0;}});
}

