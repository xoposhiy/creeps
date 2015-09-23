var roles = require('roles');
require('spawn');

RoomPosition.prototype.equalsTo = function(pos){
	return pos.x == this.x && pos.y == this.y;
};

RoomPosition.prototype.getFreeNeighboursCount = function(){
	var room = Game.rooms[this.roomName];
	var count = 0;
	for(var dx=-1; dx<=1; dx++)
		for(var dy=-1; dy<=1; dy++) {
			if (dx == 0 && dy == 0) continue;
			var pos = room.getPositionAt(this.x + dx, this.y + dy);
			var isFree = room.lookForAt('terrain', pos)[0] != 'wall' &&
				room.lookForAt('structure', pos).length == 0;
			if (isFree) count++;
		}
	return count;
};

Room.prototype.isSpawningTime = function(){
		return _.some(this.find(FIND_MY_SPAWNS), s => s.memory.wantToSpawn);
};

RoomPosition.prototype.getAssignies = function(){
	var pos = this;
	var room = Game.rooms[pos.roomName];
	room.memory.assignies = room.memory.assignies || {};
	var key = pos.toString();
	var assignies = room.memory.assignies[key] || [];
	room.memory.assignies[key] = _.filter(assignies, id => Game.getObjectById(id) && Game.getObjectById(id).memory.target == key);
	return room.memory.assignies[key];
};

RoomPosition.prototype.canAssign = function(creep){
	var pos = this;
	var assignies = pos.getAssignies();
	return assignies.indexOf(creep.id) >= 0 || assignies.length < pos.getFreeNeighboursCount();
};

RoomPosition.prototype.assign = function(creep){
	var pos = this;
	var assignies = pos.getAssignies();
	if (assignies.indexOf(creep.id) < 0) {
		if (assignies.length >= pos.getFreeNeighboursCount()) return false;
		assignies.push(creep.id);
	}
	creep.memory.target = pos.toString();
	return true;
};

Spawn.prototype.getStoredEnergy = function(){
	return this.energy;
};


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

Creep.prototype.approachAndDo = function(target, work, log){
	var creep = this;
	if (!target) return false;
	if (!target.pos.assign(creep)) return false;
	if (creep.pos.isNearTo(target.pos)) {
		var res = work();
		return Number.isInteger(res) ? res === OK : res;
	}
	else if (creep.fatigue > 0) return true;
	else {
		var moveRes = creep.moveTo(target);
		if (moveRes != OK && log)
			console.log("moveTo " + target + " " + target.pos + " from " + creep.pos + ": " + moveRes);
		return moveRes == OK;
	}
};

Structure.prototype.getStoredEnergy = function(){
	if (this.store !== undefined) return this.store.energy;
	else return this.energy;
};

Structure.prototype.getEnergyCapacity = function(){
	if (this.store != undefined) return this.storeCapacity;
	else return this.energyCapacity;
};

_.prototype.minValue = function(c, i, t){
	var res = _.min(c, i, t);
	return res === Infinity ? undefined : res;
};