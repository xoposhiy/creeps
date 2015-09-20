var rageTime = 0;
module.exports = function guard(creep){
// 	creep.getMates().forEach(function(c){c.memory.rage = false;});
	if (creep.getActiveBodyparts(ATTACK) == 0) creep.assignNewRole();
	var mates = _.filter(creep.getMates(), function(c){return !c.memory.rage;});
    var otherMates = _.filter(mates, function(m){return m != creep;});
    creep.memory.group = creep.memory.group || (otherMates.length == 0 ? new Date().getMinutes() : otherMates[0].memory.group);
    mates = _.filter(mates, function(m){return m.memory.group == creep.memory.group;})
	if (creep.memory.target == undefined){
    	var targets = creep.room.find(FIND_HOSTILE_CREEPS);
    	if (targets.length){
        	targets = _.map(creep.room.find(FIND_HOSTILE_CREEPS),
        	    function(t) { return {target: t, path: creep.room.findPath(creep.pos, t.pos)};});
        	targets = targets.filter(function(t){ return t.path != ERR_NO_PATH; });
        	targets = _.sortBy(targets, function(t) { return t.path.length; });
    	    creep.memory.target = targets[0].target;
    	}
    	else
	    {
	        creep.memory.target = undefined;
	    }
	}
    if (creep.memory.target && creep.memory.target.pos){
        var t = creep.memory.target;
        var p = creep.room.findPath(creep.pos, t.pos);
        if (!p || p.length == 0 || p[p.length-1].x != t.pos.x || p[p.length-1].y != t.pos.y) {
            creep.memory.target = undefined;
        }
        else{
            creep.say(creep.memory.group + "->" + t.pos.x + ', ' + t.pos.y);
            creep.moveTo(t.pos);
    	    creep.attack(t);
    	    creep.memory.target = undefined;
        }
	}
	else if (mates.length < 4 && !creep.memory.rage) {
	    creep.say('!W ' + creep.memory.group);
	    creep.moveTo(Game.flags.guards);
	}
	else {
	    mates.forEach(function(c){c.memory.rage = true;});
	    var exits = creep.room.find(FIND_EXIT_TOP);
        creep.say(creep.memory.group + "->" + "go " + creep.moveTo(exits[0]));
    }
}