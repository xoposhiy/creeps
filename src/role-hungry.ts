import Role = require('Role');

class HungryQueueItem {
    creepId:string;
    arrivalTime:number;
    energyNeed:number;

    constructor(id:string, arrivalTime:number, energyNeed:number) {
        this.creepId = id;
        this.arrivalTime = arrivalTime;
        this.energyNeed = energyNeed;
    }
}

class EnergyDispatcher {
    energy:number;
    miner:Creep;
    pos:RoomPosition;
    energies:Energy[];

    constructor(pos:RoomPosition) {
        if (!pos) throw new Error("bad pos");
        this.pos = pos;
        this.energies = <Energy[]>pos.lookFor("energy");
        this.energy = _.reduce(this.energies, (t, e) => t + e.energy, 0);
        this.miner = <Creep>pos.lookFor("creep")[0];
        if (this.miner) this.energy += this.miner.carry.energy;
    }

    getTimeToWait(energyNeed:number, timeInRoad:number):number {
        var prevArrivedEnergyNeed = _.chain(this.hungryQueue())
            .filter((qi:HungryQueueItem) => qi.arrivalTime < Game.time + timeInRoad)
            .reduce((total, qi) => qi.energyNeed + total, 0);
        //12 = 6 WORK body parts of miner x2:
        var energyAtArrival = this.energy + (this.miner ? timeInRoad * 12 : 0) - prevArrivedEnergyNeed;
        return Math.max(0, energyNeed - energyAtArrival) / 12;
    }

    hungryQueue():Array<HungryQueueItem> {
        if (!Memory.hungryQueues) Memory.hungryQueues = {};
        if (Game.time % 100 == 0) EnergyDispatcher.cleanHungryQueues();
        return EnergyDispatcher.hungryQueue(this.pos.toString());
    }

    static hungryQueue(pos:string):Array<HungryQueueItem> {
        var filteredQueue = _.filter(Memory.hungryQueues[pos] || [], qItem => EnergyDispatcher.isActualClient(qItem.creepId, pos));
        return Memory.hungryQueues[pos] = filteredQueue;
    }

    enqueue(energyNeed:number, timeInRoad:number, creep:Creep):boolean {
        var q = this.hungryQueue();
        if (!q.some(qItem => creep.id == qItem.creepId)) {
            if (q.length > 5) return false;
            q.push(new HungryQueueItem(creep.id, Game.time + timeInRoad, energyNeed));
        }
        return true;
    }

    getEnergySource():Energy|Creep {
        var bestEnergyDrop = _.last(_.sortBy(this.energies, "energy"));
        if (!bestEnergyDrop) return this.miner;
        if (!this.miner) return bestEnergyDrop;
        if (bestEnergyDrop.energy > this.miner.carry.energy) return bestEnergyDrop;
        return this.miner;
    }

    static isActualClient(id:string, pos:string):boolean {
        var creep = <Creep>Game.getObjectById(id);
        if (!creep) return false;
        var creepPos = creep.memory.targetPos;
        return creepPos == pos;
    }

    static cleanHungryQueues():void {
        _.keys(Memory.hungryQueues).forEach(pos => {
            if (EnergyDispatcher.hungryQueue(pos).length == 0)
                delete Memory.hungryQueues[pos];
        });
    }
}

class Hungry extends Role {

    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 &&
            creep.bodyScore([MOVE, CARRY]) > 0 &&
            super.fits(creep);
    }

    waitTimeout():number {
        return 1;
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return Game.time % 5 != 0;
    }

    getTarget(creep:Creep):RoomPosition {
        if (creep.room.forbidden()) return undefined;
        var dispatchers = this.getEnergyDispatchers(creep);
        if (creep.isDebug()) {
            console.log("energy sources: ");
            dispatchers.forEach(d => console.log(d.pos + " " + this.getTimeToGetEnergyFromDispatcher(creep, d)));
        }
        var dispatcher = _.sortBy(dispatchers, dispatcher => this.getTimeToGetEnergyFromDispatcher(creep, dispatcher))[0];
        if(!dispatcher) return undefined;
        var t = this.getTimeToGetEnergyFromDispatcher(creep, dispatcher);
        if (creep.isDebug()) {
            creep.log("best source: " + dispatcher.pos +
                " t = " + this.getTimeToGetEnergyFromDispatcher(creep, dispatcher));
        }
        if (t < 40) {
            var energyNeed = creep.carryCapacity - creep.carry.energy;
            var timeInRoad = creep.pos.findPathTo(dispatcher.pos).length;
            if (dispatcher.enqueue(energyNeed, timeInRoad, creep)) return dispatcher.pos;
        }
        return undefined;
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == creep.carryCapacity;
    }

    interactWithTarget(creep:Creep, target:RoomPosition):any {
        if (!target) return false;
        var d = new EnergyDispatcher(target);
        var energySource = d.getEnergySource();
        if (!energySource) return false;
        return creep.takeEnergyFrom(energySource);
    }

    private getEnergyDispatchers(creep:Creep):EnergyDispatcher[] {
        var energies = creep.room.find(FIND_DROPPED_ENERGY)
            .concat(creep.room.find(FIND_MY_CREEPS, {filter: c => c.memory.role == "miner"}));
        return _.chain(energies)
            .filter(o => !!o.pos)
            .map(o => new EnergyDispatcher(o.pos))
            .value();
    }

    private getTimeToGetEnergyFromDispatcher(creep:Creep, dispatcher:EnergyDispatcher):number {
        if (!dispatcher.pos) {
            Game.notify("Strange dispatcher " + JSON.stringify(dispatcher, null, ' '), 1);
            return 100500;
        }
        var path = creep.pos.findPathTo(dispatcher.pos);
        return path.length + dispatcher.getTimeToWait(creep.carryCapacity - creep.carry.energy, path.length);
    }
}

export = Hungry;