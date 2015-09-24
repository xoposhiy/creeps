module.exports = {

    waitTimeout: 10,

    /** @param {Creep} creep */
    fits: function (creep) {
        return creep.carry.energy == creep.carryCapacity &&
            creep.bodyScore([MOVE, CARRY, WORK]) > 0 && !creep.room.isSpawningTime() &&
            getTarget(creep);
    },

    /** @param {Creep} creep */
    finished: function (creep) {
        return creep.carry.energy == 0;
    },

    /** @param {Creep} creep */
    run: function (creep) {
        var target = getTarget(creep);
        return creep.approachAndDo(target, () => buildOrRepair(creep, target));
    }
};

/** @param {Creep} creep
 * @param structure
 */
function buildOrRepair(creep, structure) {
    if (structure.progress !== undefined) //ConstructionSite
        return creep.build(structure);
    else //Structure
        return creep.repair(structure);
}

/** @param {Creep} creep */
function getTarget(creep) {
    var targets = creep.room.find(FIND_CONSTRUCTION_SITES).
        concat(creep.room.find(FIND_STRUCTURES, {filter: s => s.hits < s.hitsMax && s.pos.canAssign(creep)}));
    targets = _.sortBy(targets, t => scoreBuildTarget(creep, t));
    return targets[0];
}

/** @param {Creep} creep
 * @param t
 */
function scoreBuildTarget(creep, t) {
    var hits = t.hits || 0;
    var maxHits = Math.min(150000, t.hitsMax || 1);
    var repairBonus = 20.0 * hits / maxHits;
    var buildingBonus = t.progressTotal ? -20 - (20.0 * t.progress || 0) / (t.progressTotal || 1) : 0;
    var range = t.pos.getRangeTo(creep.pos);
    var rangeBonus = range <= 1 ? -5 : 0;
    return range + rangeBonus + repairBonus + buildingBonus;
}