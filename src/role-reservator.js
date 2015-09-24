module.exports = {
	/** @param {Creep} creep */
	fits: creep => creep.carry.energy > 0 && creep.bodyScore([CARRY, MOVE]) > 0,

	/** @param {Creep} creep */
	finished: creep => creep.carry.energy == 0,

	/** @param {Creep} creep */
	run: function(creep) {
		var s = getEnergySink(creep);
		return creep.approachAndDo(s, () => creep.transferEnergy(s));
	}

};

/** @param {Creep} creep */
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
	return undefined;
}

function isFull(s){
	if (s.energy !== undefined)
		return s.energy == s.energyCapacity;
	else if (s.store !== undefined)
		return s.store.energy == s.storeCapacity;
	else
		throw "unknown storage " + s;
}