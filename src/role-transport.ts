import Role = require('Role');
import Harvester = require('role-harvester');
import Movements = require('movements');
import EnergyMine = require('EnergyMine');

class Transport extends Role {

    static wantTransport(maxEnergy:number, room:Room) {
        if (room.energyCapacityAvailable < 1500) return false;
        if (room.storage && room.storage.store.energy > room.storage.storeCapacity*0.9) return false;
        return true;
        //var mines = EnergyMine.minesByRoom(room.name);
        //var readyMines = _.filter(mines, m => {
        //    var miner = m.getAssignedMiner();
        //    return miner && miner.getActiveBodyparts(WORK) >= 5 && m.getTransportWaitTime(0, 500) == 0 && miner.pos.canAssign();
        //});
        //return readyMines.length > 0;
    }

    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 &&
            creep.bodyScore([MOVE, CARRY]) > 0 &&
            super.fits(creep);
    }

    waitTimeout():number {
        return 3;
    }

    isTargetActual(creep:Creep, target:RoomPosition):boolean {
        return !target['pos'] && !!target;
    }

    getTarget(creep:Creep):RoomPosition {
        var poss = EnergyMine.minePosFor(creep);
        var finalTarget:RoomPosition;
        if (poss) finalTarget = RoomPosition.parse(poss);
        if (!finalTarget || !finalTarget.canAssign(creep)) finalTarget = this.selectTarget(creep);
        if (!finalTarget) return null;
        if (finalTarget.roomName == creep.room.name) {
            var h = finalTarget.getArea<Creep>("creep", 1, c => c.memory.role == 'harvester')[0];
            if (h) finalTarget = h.pos;
            else {
                var e = finalTarget.getArea<Energy>("energy", 1)[0];
                if (e) finalTarget = e.pos;
            }
        }
        return Movements.getSameRoomDestinationPos(creep.pos, finalTarget);
    }

    selectTarget(creep:Creep):RoomPosition {
        var mines = EnergyMine.minesFor(creep);
        creep.log("all mines: " + mines);
        mines = _.filter(mines, m => {
            var miner = m.getAssignedMiner();
            if (miner && miner.memory['linkId']) return false;
            if (m.pos.canAssign(creep)) return true;
            return miner && miner.pos.canAssign(creep);
        });
        creep.log("assignable mines: " + mines);
        if (mines.length == 0) return null;
        if (creep.isDebug()) {
            _.forEach(mines, m => console.log(m + ' -> ' + m.getWaitTimeFor(creep)));
        }

        var mine = _.min(mines, (m:EnergyMine) => m.getWaitTimeFor(creep));
        creep.log("transport for mine " + mine + ' waitTime ' + mine.getWaitTimeFor(creep));
        mine.assignTransport(creep);
        if (mine.pos.canAssign(creep)) return mine.pos;
        return mine.getAssignedMiner().pos;
    }

    finished(creep:Creep):boolean {
        return creep.carry.energy == creep.carryCapacity;
    }

    interactWithTarget(creep:Creep, target:RoomPosition):any {
        if (!target) return false;
        if (target.isOnBorder && target.isOnBorder()) return true;
        var e = creep.pos.getArea<Energy>("energy", 1, e => e.energy > 15);
        if (e.length > 0) return creep.pickup(e[0]) == OK;
        var h = creep.pos.getArea<Creep>("creep", 1, c => c.memory.role == 'harvester' && c.carry.energy > 0);
        if (h.length > 0) return creep.takeEnergyFrom(h[0]) == OK;
        return false;
    }
}

export = Transport;