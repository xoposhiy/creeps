import Role = require('Role');

class NoRole extends Role {
    run(creep:Creep):boolean {
        return false;
    }

    fits():boolean {
        return false;
    }

    waitTimeout():number {
        return 0;
    }

    isTargetActual():boolean {
        return false;
    }

    getTarget(creep:Creep):any {
        return creep.moveTo(creep.room.controller);
    }

    finished():boolean {
        return true;
    }

    interactWithTarget():any {
        return false;
    }
}

export = NoRole;