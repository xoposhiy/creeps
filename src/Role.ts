///<reference path="screeps-extended.d.ts"/>

/*eslint no-unused-vars: 0*/
class Role {
    fits(creep:Creep):boolean {
        return !!this.getTarget(creep);
    }

    waitTimeout():number {
        return 3;
    }

    isTargetActual(creep:Creep, target:GameObject|RoomPosition):boolean {
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
            if (p.roomName === creep.room.name) {
                var newTarget = creep.room.getPositionAt(p.x, p.y);
                if (newTarget && this.isTargetActual(creep, newTarget))
                    return newTarget;
            }
        }
        return this.getTarget(creep);
    }

    actRange = 1;
    moveCloser = true;

    run(creep:Creep):boolean {
        var target = this.getCachedTarget(creep);
        var res = creep.approachAndDo(target, () => this.interactWithTarget(creep, target), this.actRange, this.moveCloser);
        creep.memory.rawTarget = target;
        creep.memory.targetId = undefined;
        creep.memory.targetPosition = undefined;
        if (res && target) {
            if (target['id'])
                creep.memory.targetId = target["id"];
            else if (target instanceof RoomPosition)
                creep.memory.targetPosition = <RoomPosition>target;
        }
        return res;
    }
}

export = Role;