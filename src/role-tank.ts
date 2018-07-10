import Role = require('Role');
import Movements = require('movements');

var structureFilter = {filter: (s:Structure) =>
    !s.my &&
    s.structureType != 'controller' &&
    s.structureType != 'spawn' &&
    s.structureType != 'keeperLair' };

class Tank extends Role {
    static getBody(maxEnergy:number){
        return _.sortBy(Creep.makeBody(maxEnergy, [MOVE, ATTACK], 15), x => x == MOVE ? 0 : 1);
    }

    fits(creep:Creep):boolean {
        return creep.bodyScore([ATTACK, MOVE]) > 0 &&
            !!this.getEnemy(creep);
    }

    finished(creep:Creep):boolean {
        return false;
    }

    run(creep:Creep):boolean {
        var meleeAttack =
            this.doMeleeAttack(creep, <Creep[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1)) ||
            this.doMeleeAttack(creep, <Structure[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1, structureFilter)) ||
            this.doMeleeAttack(creep, <Structure[]>creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (s:Structure) => this.isWall(s) && !s.room.controller.my}));
        var moved = this.moveSomewhere(creep);
        return meleeAttack || moved;
    }

    private moveSomewhere(creep:Creep):boolean {
        if (creep.fatigue > 0) return true;
        var enemy = this.getEnemy(creep);
        if (!enemy)return false;
        return creep.moveTo(enemy.pos) == OK;
    }

    private getEnemy(creep:Creep):GameObject {
        var flag = Game.flags['destroy'];
        if (flag && flag.pos.roomName != creep.room.name) flag = undefined;
        var target:GameObject = flag ? flag.pos.lookFor<Structure>("structure")[0] : undefined;
        target = target ||
            <Creep>creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS) ||
            <Structure>creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, structureFilter) ||
            <Structure>creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s:Structure) => s.structureType == "constructedWall" && !s.room.controller.my}) ||
            <ConstructionSite>creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {filter: cs => !cs.my});
        creep.log('target: ' + target);
        return target;
    }

    private doMeleeAttack(creep:Creep, targets:Structure[]|Creep[]):boolean {
        if (!targets.length) return false;
        var rangedAttackTarget = _.sortBy(targets, (e:Structure|Creep) => this.attackCost(e))[0];
        creep.attack(rangedAttackTarget);
        return true;
    }

    private isWall(e:GameObject):boolean {
        return e['structureType'] == 'constructedWall';
    }

    private attackCost(e:Creep|Structure):number {
        var hits = e.hits;
        if (e['getActiveBodyparts']) {
            var c = <Creep>e;
            var attack = c.getActiveBodyparts(ATTACK);
            var rangedAttack = c.getActiveBodyparts(RANGED_ATTACK);
            var heal = c.getActiveBodyparts(HEAL);
            var ramparts = c.room ? _.filter(c.room.lookAt(c.pos), (r:LookAtResult) => r.type == "structure" && r.structure.structureType == "rampart") : [];
            var defence = _.reduce(ramparts, (t, r) => t + r.structure.hits, 0);
            return hits + defence - 5 * attack - 10 * rangedAttack - 12 * heal;
        }
        else
            return hits;
    }
}

export = Tank;