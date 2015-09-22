var smallImp = [WORK, CARRY, MOVE]; //200
var medImp = [WORK, CARRY, MOVE, WORK, CARRY, MOVE]; //400
var imp = [
	WORK, CARRY, MOVE,
	WORK, CARRY, MOVE, 
	WORK, CARRY, MOVE, 
	WORK, MOVE]; //750

var heavyImp = [
	WORK, CARRY, MOVE,
	WORK, CARRY, MOVE, 
	WORK, CARRY, MOVE, 
	WORK, MOVE, ATTACK, HEAL]; //1150

var getNextCreepBody = function(){
	var workCount = _.reduce(Game.creeps, (res, c) => res + c.getActiveBodyparts(WORK), 0);
	if (workCount < 2) return smallImp;
	if (workCount < 4) return medImp;
	if (workCount < 8) return imp;
	return heavyImp;
};

Spawn.prototype.spawnCreep = function (body){
	body = body || getNextCreepBody();
	var canCreate = this.canCreateCreep(body);
	if (canCreate != OK) return canCreate;
	console.log("SPAWN " + body);
	return this.createCreep(body, 'c' + body.length + '_' + Game.time, {role: 'no'});
};
