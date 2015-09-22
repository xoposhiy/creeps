module.exports = {
	fits: creep => creep.bodyScore([CARRY, MOVE]) > 0 && creep.carry.energy > 0,

	finished: creep => creep.carry.energy == 0,

	run: function(creep) {
		var s = getEnergySink(creep);
		if (!s) console.log(creep + ' reservator has no sinks!');
		return creep.approachAndDo(s, () => creep.transferEnergy(s));
	}

};

function getEnergySink(creep){
	var spawnOrExtension = creep.pos.findClosestByPath(
		FIND_STRUCTURES, {filter: s => 
			(s.structureType == STRUCTURE_EXTENSION || s.structureType == 'spawn') &&
			!isFull(s) && s.my
		});
	if (spawnOrExtension) return spawnOrExtension; //better than storage!
	var storage = creep.pos.findClosestByPath(FIND_STRUCTURES, 
		{filter: s => s.structureType == STRUCTURE_STORAGE && !isFull(s) && s.my});
	if (storage) return storage;
	return Game.flags.scouts;
}

function isFull(s){
	if (s.energy !== undefined)
		return s.energy == s.energyCapacity;
	else if (s.store !== undefined)
		return s.store.energy == s.storeCapacity;
	else
		throw "unknown storage " + s;
}