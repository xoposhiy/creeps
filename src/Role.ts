///<reference path="screeps-extended.d.ts"/>

/*eslint no-unused-vars: 0*/
class Role {
    fits(creep:Creep):boolean {
        return !!this.getTarget(creep);
    }

    waitTimeout():number {
        return 10;
    }

    isTargetActual(creep:Creep, target:GameObject):boolean {
        throw new TypeError();
    }

    getTarget(creep:Creep):GameObject|RoomPosition {
        throw new TypeError();
    }

    finished(creep:Creep):boolean {
        throw new TypeError();
    }

    interactWithTarget(creep:Creep, target:GameObject|RoomPosition):boolean|number {
        throw new TypeError();
    }

    getCachedTarget(creep:Creep):GameObject|RoomPosition {
        var cachedTarget = creep.memory.targetId ? Game.getObjectById(creep.memory.targetId) : undefined;
        if (cachedTarget && this.isTargetActual(creep, cachedTarget)) {
            return cachedTarget;
        } else if (creep.memory.targetPosition) {
            var p = creep.memory.targetPosition;
            var room = Game.rooms[p.roomName];
            if (!room) {
                console.log('unknown room ' + p.roomName);
                return this.getTarget(creep);
            }
            return room.getPositionAt(p.x, p.y)
        }
        else {
            return this.getTarget(creep);
        }
    }

    moveOnTarget = false;

    run(creep:Creep):boolean {
        var target = this.getCachedTarget(creep);
        var res = creep.approachAndDo(target, () => this.interactWithTarget(creep, target), this.moveOnTarget);
        creep.memory.rawTarget = target;
        creep.memory.targetId = undefined;
        creep.memory.targetPosition = undefined;
        if (res && target) {
            if (target['id'])
                creep.memory.targetId = (<GameObject>target).id;
            else
                creep.memory.targetPosition = <RoomPosition>target;
        }
        return res;
    }

    controlCreep(creep) {
        if (this.finished(creep)) {
            creep.assignNewRole(true);
        }
        else if (this.run(creep)) {
            creep.memory.startWaitTime = undefined;
        }
        else {
            creep.memory.startWaitTime = creep.memory.startWaitTime || Game.time;
            var t = this.waitTimeout;
            var waitTimeout = t === undefined ? 10 :
                _.isNumber(t) ? t : t();
            if (creep.memory.startWaitTime + waitTimeout < Game.time) {
                creep.assignNewRole(false);
            }
        }
    }
}

export = Role;