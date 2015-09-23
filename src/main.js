require('extensions');
var roles = require('roles');

module.exports.loop = function(){
	_.forEach(Game.spawns, spawn => spawn.controlSpawn());
	_.forEach(Game.creeps, creep => {
		if (creep.spawning) return;
		var roleImpl = roles.impl[creep.memory.role];
		roleImpl.controlCreep(creep);
		if (Game.time % 4 == 0)
			creep.say(creep.memory.role);
	});
};
