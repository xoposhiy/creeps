module.exports = function (creep) {
	if (creep.getActiveBodyparts(WORK) == 0) creep.suicide();
	if(creep.carry.energy == creep.carryCapacity || creep.memory.unloading && creep.carry.energy != 0) {
	    creep.memory.unloading = true;
	    tryReturnEnergy(creep);
	}
	else {
	    creep.memory.unloading = false;
        if (!tryMoveToSource(creep))
            creep.assignNewRole();
	}
}

function tryReturnEnergy(creep){
    var s = getClosestEnergySink(creep);
    if (!s) return false;
    var path = creep.room.findPath(creep.pos, s.pos);
    if (path.length){
        creep.moveTo(s);
	    creep.transferEnergy(s);
    }
}

function getEnergySink(creep){
	var home = Game.spawns.home;
    if (home.energy == home.energyCapacity){
        var extensions = creep.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }
        });
        for(var i=0; i<extensions.length; i++) {
            var e = extensions[i];
            if (e.energy < e.energyCapacity){
	            return e;
            }
        }
    }
    else
        return home;
}

function getClosestEnergySink(creep){
    var sinks = creep.room.find(FIND_MY_STRUCTURES, {
        filter: { structureType: STRUCTURE_EXTENSION }
    });
    sinks.push(Game.spawns.home);
    var sinks = _.filter(sinks,
        function(s){ return s.energy < s.energyCapacity});
    return creep.pos.findClosestByPath(sinks);
}

function tryMoveToSource(creep){
	var sources = creep.room.find(FIND_SOURCES);
	for(var i=0; i<sources.length; i++)
	{
	    var src = sources[i];
	    var path = creep.room.findPath(creep.pos, src.pos, {ignoreCreeps: false});
	    if(path.length && src.pos.equalsTo(path[path.length - 1]) )
        {
            creep.move(path[0].direction);
	        creep.harvest(src);
	        return true;
        }
	}
	creep.say('no way');
	return false;
}

function tryScoutNear(creep){
	var sources = creep.room.find(FIND_EXIT_BOTTOM);
    creep.moveTo(sources[0]);
    
}
