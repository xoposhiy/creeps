///<reference path="lodash.d.ts"/>

import Role = require('Role');

class Scout extends Role {

    actRange = 0;

    fits(creep:Creep):boolean {
        return creep.carry.energy == 0 && creep.ticksToLive > 100 &&
            creep.bodyScore([WORK, CARRY, MOVE, MOVE]) &&
            super.fits(creep);
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        return true;
    }

    getTarget(creep:Creep):RoomPosition {
        creep.memory.scoutStartRoom = creep.room.name;
        var exits = Game.map.describeExits(creep.room.name);
        var dirs = _.filter([TOP, BOTTOM, LEFT, RIGHT], d => exits[d] && this.freeRoom(exits[d]));
        return <RoomPosition>creep.pos.findClosestByPath(dirs[Game.time++ % dirs.length]);
    }

    private freeRoom(roomName:string):boolean {

        return Game.rooms[roomName] == undefined || Game.rooms[roomName].controller == undefined || Game.rooms[roomName].controller.owner == undefined;
    }

    finished(creep:Creep):boolean {
        var leaveRoom = creep.memory.scoutStartRoom !== undefined && creep.room.name != creep.memory.scoutStartRoom;
        return leaveRoom || creep.room.controller == undefined;
    }

    interactWithTarget(creep:Creep, target:GameObject):any {
        return true;
    }
}

export = Scout;