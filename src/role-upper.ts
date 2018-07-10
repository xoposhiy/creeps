///<reference path="screeps-extended.d.ts"/>

import Role = require('Role');

class Upper extends Role {

    fits(creep:Creep):boolean {
        return creep.name == creep.room.name;
    }

    finished(creep:Creep):boolean {
        return false;
    }


    run(creep:Creep):boolean {
        if (!creep.pos.isNearTo(creep.room.controller.pos))
            creep.moveTo(creep.room.controller);
        else if (creep.room.storage && !creep.room.storage.pos.isNearTo(creep.pos))
            creep.moveTo(creep.room.storage);
        else{
            var link = creep.pos.getArea<Link>("structure", 2, s => s.structureType == STRUCTURE_LINK)[0];
            if (link && !link.pos.isNearTo(creep.pos))
                creep.moveTo(link);
        }
        if (creep.pickEnergy(['harvester', 'miner', 'reservator', 'upgrader']) || creep.carry.energy > 0)
            creep.upgradeController(creep.room.controller);
        creep.room.controller.pos.assign(creep, true);
        return true;
    }

    static wantUpper(maxEnergy:number, room:Room): boolean{
        var currentUpper = Game.creeps[room.name];
        return !currentUpper && room.storage && Upper.getBody(maxEnergy).indexOf(WORK) >= 0;
    }

    static getBody(maxEnergy:number): string[]{
        var startSegment =
            (maxEnergy >= 4000) ? [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY] :
            (maxEnergy >= 2000) ? [MOVE, MOVE, MOVE, CARRY, CARRY] :
            (maxEnergy >= 1000) ? [MOVE, MOVE, CARRY, CARRY] :
            (maxEnergy >= 550) ? [MOVE, CARRY, CARRY] :
            [MOVE, CARRY];

        return Creep.makeBody(maxEnergy, [WORK], 50, startSegment);
    }

    static forRoom(room:Room){
        return Game.creeps[room.name];
    }
}

export = Upper;
