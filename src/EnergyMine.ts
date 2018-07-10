///<reference path="screeps-extended.d.ts"/>

class EnergyMine {
    constructor(flag:Flag) {
        var parts = flag.name.split('-');
        this.motherRoom = Game.rooms[parts[1]];
        this.pos = flag.pos;
        this.distance = +parts[2];
        this.flag = flag;
    }

    static minesByRoom(roomName:string):EnergyMine[] {
        if (!Memory['minesByRoom'][roomName]) Memory['minesByRoom'][roomName] = [];
        return Memory['minesByRoom'][roomName];

    }

    static initializeMinesMemory() {
        Memory['minesByRoom'] = {};
        Memory['minersByPos'] = Memory['minersByPos'] || {};
        Memory['transportsByMine'] = Memory['transportsByMine'] || {};
        _.forEach(Game.flags, flag => {
            var mine = new EnergyMine(flag);
            if (mine.isValid())
                EnergyMine.minesByRoom(mine.motherRoom.name).push(mine);
        });
    }

    static minesFor(creep:Creep):EnergyMine[] {
        var roomName = creep.longMemory().roomName;
        if (!roomName) return [];
        return EnergyMine.minesByRoom(roomName);
    }

    isValid():boolean {
        if (!_.startsWith(this.flag.name, "mine-")) return false;
        var isValid = this.motherRoom && this.motherRoom.controller && this.motherRoom.controller.my;
        if (!isValid)
            console.log("invalid mine flag " + this.flag + " at " + this.flag.pos);
        return isValid;
    }

    private miner:Creep;

    static minePosFor(creep:Creep, value?:string):string{
        if (value)
            creep.memory['minePos'] = value;
        return creep.memory['minePos'];
    }

    assignMiner(creep:Creep){
        var poss = this.pos.toString();
        Memory['minersByPos'][poss] = creep.id;
        EnergyMine.minePosFor(creep, poss);
        this.miner = creep;
    }

    canAssign(creep:Creep):boolean{
        if (Game.map.isRoomProtected(this.pos.roomName)) return false;
        var miner = this.getAssignedMiner();
        return (!miner || miner.id == creep.id) && this.pos.canAssign(creep);
    }

    getAssignedMiner():Creep {
        if (this.miner != undefined) return this.miner;
        var poss = this.pos.toString();
        var minerId = Memory['minersByPos'][poss];
        if (!minerId) {
            return this.miner = null;
        }
        var creep = <Creep>Game.getObjectById(minerId);
        if (!creep || EnergyMine.minePosFor(creep) != poss) {
            Memory['minersByPos'][poss] = undefined;
            return this.miner = null;
        }
        return this.miner = creep;
    }

    getTransportIds():string[]{
        var poss = this.pos.toString();
        var idByPos:HashTable<string[]> = Memory['transportsByMine'];
        var ids:string[] = idByPos[poss];
        return idByPos[poss] = ids ? _.filter(ids, id => this.isStillAssigned(id)) : [];
    }

    private isStillAssigned(id:string):boolean {
        var creep = <Creep>Game.getObjectById(id);
        return creep && EnergyMine.minePosFor(creep) == this.pos.toString();
    }

    assignTransport(transport:Creep){
        var poss = this.pos.toString();
        var transportIds = this.getTransportIds();
        if (transportIds.indexOf(transport.id) >= 0) return;
        transportIds.push(transport.id);
        EnergyMine.minePosFor(transport, poss);
    }

    getHarvestedEnergy():number {
        var room = Game.rooms[this.pos.roomName];
        if (!room) return 0; // actually don't know
        var energy = _.sum(this.pos.getArea<Energy>('energy', 1), e => e.energy);
        var miner = this.getAssignedMiner();
        if (miner) energy += miner.carry.energy;
        return energy;
    }

    getHarvestSpeed():number{
        var miner = this.getAssignedMiner();
        if (!miner || !miner.pos.isNearTo(this.pos) || miner.memory['linkId']) return 0;
        return 2*miner.getActiveBodyparts(WORK);
    }

    getWaitTimeFor(transport:Creep):number {
        var dist = this.pos.estimateDistanceTo(transport.pos);
        var carry = transport.getActiveBodyparts(CARRY);
        return this.getTransportWaitTime(dist, carry*50);
    }

    getTransportWaitTime(time:number, energyRequired:number):number {
        var energyNow = this.getHarvestedEnergy();
        var assignedCarries = _.sum(this.getTransportIds(), id => (<Creep>Game.getObjectById(id)).getActiveBodyparts(CARRY));
        var harvestSpeed = this.getHarvestSpeed();
        var energyAtArriveTime = (energyNow + time * harvestSpeed - 50 * assignedCarries);
        if (harvestSpeed == 0)
            if(energyRequired > energyAtArriveTime) return 100500;
            else return 0;
        return Math.max(0, energyRequired - energyAtArriveTime) / harvestSpeed;
    }

    toString():string {
        return this.flag.toString();
    }

    motherRoom:Room;
    pos:RoomPosition;
    distance:number;
    flag:Flag;
}

export = EnergyMine;