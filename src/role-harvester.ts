import Role = require('Role');
import refs = require('refs');
import Movements = require('movements');
import EnergyMine = require('EnergyMine');

class Harvester extends Role {
    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 &&
            creep.bodyScore([WORK, WORK, CARRY, MOVE]) > 0 &&
            super.fits(creep);
    }

    finished(creep:Creep):boolean {
        var droppedEnergy = creep.pos.lookFor<Energy>("energy")[0];
        return creep.carry.energy == creep.carryCapacity &&
            (creep.getActiveBodyparts(WORK) < 5 ||
            creep.room.controller && creep.room.controller.my && droppedEnergy && droppedEnergy.energy > 1000);
    }


    getTarget(creep:Creep):RoomPosition {
        var poss = EnergyMine.minePosFor(creep);
        var finalTarget;
        if (poss) {
            finalTarget = RoomPosition.parse(poss);
        }
        else
            finalTarget = this.selectTarget(creep);
        if (!finalTarget) return null;
        return Movements.getSameRoomDestinationPos(creep.pos, finalTarget);
    }

    selectTarget(creep:Creep):RoomPosition {
        var mines = EnergyMine.minesFor(creep);
        creep.log("harvester.all-mines: " + mines.toString());
        mines = _.filter(mines, (m:EnergyMine) => m.canAssign(creep));
        creep.log("harvester.mines: " + mines.toString());
        if (mines.length == 0) return null;
        var mine = _.min(mines, m => creep.pos.estimateDistanceTo(m.pos));
        creep.log("harvester.selectedMine: " + mine + " estimated distance = " + creep.pos.estimateDistanceTo(mine.pos));
        mine.assignMiner(creep);
        return mine.pos;
    }

    isTargetActual(creep:Creep, target:RoomPosition):boolean {
        return true;
    }

    //moveCloser = false;

    interactWithTarget(creep:Creep, target:RoomPosition) {
        if (!target['lookFor']) {
            console.log('WTF, harvester try to interact with non-position target: ');
            console.log(global['s'](target));
            return false;
        }
        if (creep.carry.energy == creep.carryCapacity) {
            var link : Link;
            var linkId = creep.memory['linkId'];
            if (linkId === undefined) {
                link = target.getArea<Link>("structure", 2, s => s.structureType == STRUCTURE_LINK)[0];
                creep.memory['linkId'] = link ? link.id : null;
            }
            else {
                link = linkId ? <Link>Game.getObjectById(linkId) : null;
            }
            if (link) {
                creep.log('has link' + link);
                if (!link.pos.isNearTo(creep.pos)) {
                    creep.moveTo(link);
                }
                else
                {
                    creep.transferEnergy(link, Math.min(creep.carry.energy, link.energyCapacity - link.energy));
                }
            }
        }
        var s = target.lookFor<Source>("source")[0];
        if (!s) return true;
        return s.energy == 0 || creep.harvest(s) == OK;
    }
}

export = Harvester;