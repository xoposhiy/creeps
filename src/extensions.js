var roles = require('roles');
require('spawn');

Creep.prototype.assignNewRole = function(role) { return roles.assignNewRole(this, role); };
Creep.prototype.getCreepsByRole = roles.getCreepsByRole;
Creep.prototype.takeEnergyFrom = function(obj){
	if (obj.transferEnergy !== undefined) return obj.transferEnergy(this);
	else return this.pickup(obj);
};

Creep.prototype.bodyScore = function(requiredParts){
	var creep = this;
	return _.reduce(requiredParts, (score, p) => score * creep.getActiveBodyparts(p), 1);
};

Creep.prototype.approachAndDo = function(target, work){
	var creep = this;
	if (!target) return false;
	if (creep.pos.isNearTo(target.pos)) {
		var res = work();
		return Number.isInteger(res) ? res === OK : res;
	}
	else if (creep.fatigue > 0) return true;
	else return creep.moveTo(target) == OK;
}

Structure.prototype.getStoredEnergy = function(){
	if (this.store !== undefined) return this.store.energy;
	else return this.energy;
};

Spawn.prototype.getStoredEnergy = function(){
	return this.energy;
};

Structure.prototype.getEnergyCapacity = function(){
	if (this.store != undefined) return this.storeCapacity;
	else return this.energyCapacity;
};

RoomPosition.prototype.equalsTo = function(pos){
	return pos.x == this.x && pos.y == this.y;
};

_.prototype.minValue = function(c, i, t){
	var res = _.min(c, i, t);
	return res === Infinity ? undefined : res;
}