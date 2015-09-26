import Role = require('Role');

class NoRole extends Role {

    fits():boolean {
        return false;
    }

    waitTimeout():number {
        return 0;
    }

    isTargetActual():boolean {
        return false;
    }

    getTarget():any {
        return undefined;
    }

    finished():boolean {
        return true;
    }

    interactWithTarget():any {
        return false;
    }
}

export = NoRole;