var roles = require('roles');

module.exports = function assignNewRole() {
    var creep = this;
    var oldRole = creep.memory.role;
    
    this.memory.startWaitTime = undefined;
    
    var creeps = creep.getCreepsByRole();
    
    if (creeps['builder'].length < 2 && roles['builder'].fits(creep))
        creep.memory.role = 'builder';
    else if (creeps['harvester'].length < 3 && creep.getActiveBodyparts(WORK) > 1)
        this.memory.role = 'harvester';
    else if (creeps['upgrader'].length < 1 && creep.getActiveBodyparts(WORK) > 1)
        this.memory.role = 'upgrader';
  	else if (creeps['scout'].length < 3 && creep.getActiveBodyparts(WORK) > 1)
  	    this.memory.role = 'scout';
 	else if (creeps['cargo'].length < 3 && roles['cargo'].fits(creep))
 	    this.memory.role = 'cargo';
 	else if (roles['hungry'].fits(creep))
        this.memory.role = 'hungry';
	console.log("assign role for " + creep + " from " + oldRole + " to " + creep.memory.role);
	creep.say("!" + creep.memory.role);
}