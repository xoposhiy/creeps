///<reference path="screeps-extended.d.ts"/>

Structure.prototype.getEnergyCapacity = function () {
    return this['store'] != undefined ? this['storeCapacity'] : this['energyCapacity'];
};

export var success = true;