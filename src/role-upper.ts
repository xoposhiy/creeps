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

        creep.moveTo(creep.room.controller);
        creep.pickEnergy(['harvester', 'miner', 'reservator', 'builder', 'upgrader']);
        creep.upgradeController(creep.room.controller);
        creep.room.controller.pos.assign(creep, true);
        return true;
    }

    static wantUpper(maxEnergy:number, room:Room): boolean{
        var currentUpper = Game.creeps[room.name];
        return !currentUpper && Upper.getBody(maxEnergy).indexOf(WORK) >= 0;
    }

    static getBody(maxEnergy:number): string[]{
        var startSegment =
            (maxEnergy >= 1000) ? [MOVE, MOVE, CARRY, CARRY] :
            (maxEnergy >= 550) ? [MOVE, CARRY, CARRY] :
            [MOVE, CARRY];

        return Creep.makeBody(maxEnergy, [WORK], 30, startSegment);
    }

    static forRoom(room:Room){
        return Game.creeps[room.name];
    }
}

export = Upper;
