var roles = require('roles');
Creep.prototype.assignNewRole = require('assignNewRole');
Creep.prototype.takeEnergy = require('takeEnergy');
RoomPosition.prototype.equalsTo = function(pos){
    return pos.x == this.x && pos.y == this.y;
}

var bornNewCreep = require('bornNewCreep');

bornNewCreep();

for(var name in Game.creeps) {
    var creep = Game.creeps[name];
    var impl = roles[creep.memory.role];
    if (impl.run) runRole(impl, creep);
    else impl(creep);
    if (Game.time % 4 == 0)
        creep.say(creep.memory.role);
}

function runRole(impl, creep){
    if (impl.finished(creep)) {
        creep.say("finished!");
        creep.assignNewRole();
    }
    else if (impl.run(creep)){
        creep.memory.startWaitTime = undefined;
    }
    else {
        creep.memory.startWaitTime = creep.memory.startWaitTime || Game.time;
        var waitTimeout = impl.waitTimeout || 10;
        if (creep.memory.startWaitTime + waitTimeout < Game.time){
            var oldRole = creep.memory.role;
            creep.assignNewRole();
        }
    }
}
