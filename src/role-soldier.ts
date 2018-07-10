import Role = require('Role');
import Movements = require('movements');

var damageByRange = {
    1: 10,
    2: 4,
    3: 1
};

var structureFilter = {filter: (s:Structure) => s.my == false && s.structureType != 'controller' && s.structureType != 'keeperLair'};

class Soldier extends Role {

    static wantSoldier(spawn) {
        var opts = {filter: c => c.getActiveBodyparts(RANGED_ATTACK) > 0 || c.getActiveBodyparts(ATTACK)};
        var warriors = spawn.room.find(FIND_MY_CREEPS, opts).length;
        var enemies = spawn.room.find(FIND_HOSTILE_CREEPS, opts).length;
        return (enemies > 0 || Game.flags['ranger'] && Game.flags['ranger'].color == COLOR_WHITE) && warriors < 2;
    }

    static getBody(maxEnergy) {
        return _.sortBy(Creep.makeBody(maxEnergy, [MOVE, RANGED_ATTACK], 15), p => p==MOVE ? 0 : 1);
    }

    static getSmallBody(maxEnergy) {
        var regEnergy = maxEnergy;
        var segmentPrice = Creep.bodyCost([MOVE, RANGED_ATTACK]);
        var n = Math.floor(regEnergy / segmentPrice);
        var body = [];
        for (var i = 0; i < n; i++) {
            body.push(RANGED_ATTACK);
        }
        for (var i = 0; i < n; i++) {
            body.push(MOVE);
        }
        return body;
    }

    fits(creep:Creep):boolean {
        return creep.bodyScore([RANGED_ATTACK, MOVE]) > 0 &&
            !!this.getEnemy(creep);
    }

    finished(creep:Creep):boolean {
        return creep.hits < 2 * creep.hitsMax / 3;
    }

    run(creep:Creep):boolean {
        var rangedAttack =
            this.doRangedAttack(creep, <Creep[]>creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3)) ||
            this.doRangedAttack(creep, <Structure[]>creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3, structureFilter)) ||
            this.doRangedAttack(creep, <Structure[]>creep.pos.findInRange(FIND_STRUCTURES, 3, {filter: (s:Structure) => s.structureType == "constructedWall" && !s.room.controller.my}));
        var moved = this.moveSomewhere(creep);
        return rangedAttack || moved;
    }

    private moveSomewhere(creep:Creep):boolean {
        if (creep.fatigue > 0) return true;
        var enemy = this.getEnemy(creep);
        if (!enemy)return false;
        var targetPos = enemy.pos;
        var r = targetPos.getRangeTo(creep.pos);
        if (r == 3) return true;
        if (r < 3 && enemy instanceof Creep) {
            targetPos = Movements.kite(creep.pos, targetPos);
            creep.log("r = " + r + " kite to " + targetPos);
        }
        if (!targetPos) return false;
        return creep.moveTo(targetPos) == OK;
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

    private doRangedAttack(creep:Creep, targets:Structure[]|Creep[]):boolean {
        var flag = Game.flags['destroy'];
        var target = flag ? (<Structure>flag.pos.lookFor("structure")[0] || <ConstructionSite>flag.pos.lookFor("constructionSite")[0]) : undefined;
        if (target) {
            creep.log("attack destroy-flag-structure " + target);
            creep.rangedAttack(target);
            return true;
        }
        if (!targets.length) return false;
        var massDamage = _.reduce(targets, (t, e:GameObject) => t + this.isWall(e) ? 0 : damageByRange[e.pos.getRangeTo(creep.pos)], 0);
        creep.log("mass damage: " + massDamage);
        if (massDamage > 10) {
            creep.rangedMassAttack();
        }
        else {
            var rangedAttackTarget = _.sortBy(targets, (e:Structure|Creep) => this.attackCost(e))[0];
            creep.rangedAttack(rangedAttackTarget);
        }
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

    private doCloseAttackCreeps(creep:Creep, targets:Creep[] | Structure[]):boolean {
        var target = _.sortBy(targets, (e:Creep|Structure) => this.attackCost(e))[0];
        return target && creep.attack(target) == OK;
    }
}

export = Soldier;