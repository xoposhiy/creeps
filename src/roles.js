var allRoles = ['harvester', 'upgrader', 'builder', 'scout', 'cargo', 'hungry', 'reservator', 'returner', 'no'];

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

/** @param impl
 * @param {Creep} creep */
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

/** @param {Creep} creep
 * @param {Boolean} finished
 */
function assignNewRole(creep, finished) {
	var oldRole = creep.memory.role;
	var newRole = getNewRole(creep);
	console.log(Game.time + " ROLE " + _.padLeft(oldRole, 12) + " → " + _.padRight(newRole, 12) + 
				" " + creep + " " + creep.pos + 
				(finished ? "" : " TIMEOUT"));
	creep.memory = { role: newRole };
	creep.say("!" + newRole);
}

/** @param {Creep} creep */
function getNewRole(creep){
	var creeps = getCreepsByRole();
	var tryRole = (role, maxCreepsThisRole, totalCreeps) => 
		{
			maxCreepsThisRole = maxCreepsThisRole || 100500;
			totalCreeps = totalCreeps || 0;
			if (!creeps[role]) console.log("unknown " + role);
			return (_.values(Game.creeps).length >= totalCreeps && 
				creeps[role].length < maxCreepsThisRole && 
				roles.impl[role].fits(creep)) ? 
					role : undefined; 
		};
	var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES).length;
	return (
		tryRole('harvester') || 
		tryRole('builder', constructionSites/2 + 1) || 
		tryRole('upgrader') ||
		tryRole('cargo') || 
		tryRole('hungry') ||
		tryRole('returner') ||
		tryRole('reservator') ||
		tryRole('scout') ||
		'no'
		);
}

module.exports = roles;
