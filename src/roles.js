var allRoles = ['harvester', 'upgrader', 'builder', 'scout', 'cargo', 'hungry', 'reservator', 'no'];

var roles = {
	all: allRoles,
	impl: _.zipObject(_.map(allRoles, r => [r, loadRoleImpl(r)])),
	assignNewRole: assignNewRole,
	getCreepsByRole: getCreepsByRole
};

function loadRoleImpl(role){
	var impl = require("role-" + role);
	if (!impl.run || !impl.fits || !impl.finished)
		console.log("bad role " + role);
	impl.controlCreep = function(creep){ return runRole(impl, creep); };
	return impl;
}

function runRole(impl, creep){
	if (impl.finished(creep)) {
		creep.say("finished!");
		creep.assignNewRole(true);
	}
	else if (impl.run(creep)){
		creep.memory.startWaitTime = undefined;
	}
	else {
		creep.memory.startWaitTime = creep.memory.startWaitTime || Game.time;
		var waitTimeout = impl.waitTimeout || 10;
		if (creep.memory.startWaitTime + waitTimeout < Game.time){
			creep.assignNewRole(false);
		}
	}
}

function getCreepsByRole(){
	var creeps = _.values(Game.creeps);
	var res = _.map(allRoles, r => [r, _.filter(creeps, c => c.memory.role == r)]);
	return _.zipObject(res);		
}

function assignNewRole(creep, finished) {
	var oldRole = creep.memory.role;
	var newRole = getNewRole(creep);
	console.log("ROLE " + _.padLeft(oldRole, 12) + " → " + _.padRight(newRole, 12) + 
				" " + creep + " " + creep.pos + 
				(finished ? "" : " TIMEOUT"));
	creep.memory.role = newRole;
	creep.say("!" + creep.memory.role);
}

function getNewRole(creep){
	var creeps = getCreepsByRole();
	var tryRole = (role, maxCreepsThisRole, totalCreeps) => 
		{
			totalCreeps = totalCreeps || 0;
			if (!creeps[role]) console.log("unknown " + role);
			return (_.values(Game.creeps).length >= totalCreeps && 
				creeps[role].length < maxCreepsThisRole && 
				roles.impl[role].fits(creep)) ? 
					role : undefined; 
		};
	return (
		tryRole('harvester', 3, 0) || 
		tryRole('upgrader', 1, 4) || 
		tryRole('builder', 1, 5) || 
		tryRole('reservator', 1, 0) ||
		tryRole('cargo', 2, 0) || 
		tryRole('hungry', 3, 0) ||
		tryRole('scout', 10, 6) ||
		tryRole('reservator', 10000000, 0) ||
		'no'
		);
}

module.exports = roles;
