import Role = require('Role');
import Movements = require('movements');

class Defender extends Role {

    fits(creep: Creep): boolean {
        return creep.room.controller && creep.room.controller.my &&
            (creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0) &&
            creep.getActiveBodyparts(MOVE) > 0 &&
            super.fits(creep);
    }

    finished(creep: Creep): boolean {
        return false;
    }

    getTarget(creep:Creep): RoomPosition {
        var enemy = <Creep>creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (e:Creep) => this.getRampartsNear(e.pos).length > 0});
        if (enemy) {
            var ramparts = _.filter(this.getRampartsNear(enemy.pos), r => r.pos.lookFor("creep").every((c:Creep) => c.id == creep.id));
            var rampart = <Rampart>creep.pos.findClosestByPath(ramparts);
            if (rampart) {
                creep.log("enemy " + enemy + " at " + enemy.pos + " with rampart near at " + rampart.pos);
                return rampart.pos;
            }
        }
        enemy = <Creep>creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if (!enemy) return undefined;
        creep.log("enemy " + enemy + " at " + enemy.pos);

        if (this.getRampartAt(creep.pos)) return creep.pos;
        var path = creep.pos.findPathTo(enemy.pos);
        //rampart on path:
        var pathPos = _.chain(path).map(pi => creep.room.getPositionAt(pi.x, pi.y)).value();
        var rampartPos:RoomPosition = _.filter(pathPos, (pos:RoomPosition) => !!this.getRampartAt(pos))[0];
        if (rampartPos) {
            creep.log("go to rampart on the path to enemy " + rampartPos);
            return rampartPos;
        }
        //got to distance 3 to enemy
        if (path.length >= 4) {
            var pathItem = path[path.length - 4];
            creep.log("just go closer to enemy");
            return creep.room.getPositionAt(pathItem.x, pathItem.y);
        }
        creep.log("kite from enemy");
        return Movements.kite(creep.pos, enemy.pos);
    }

    isTargetActual(creep:Creep, target:RoomPosition):boolean {
        return !!this.getRampartAt(target); // otherwise target position may move
    }

    waitTimeout():number {
        return 10;
    }


    run(creep:Creep):boolean {
        var enemies = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if (enemies.length) {
            var enemy = <Creep>_.sortBy(enemies, (e:Creep) => e.hits)[0];
            creep.rangedAttack(enemy);
        }
        super.run(creep);
        return false;
    }

    interactWithTarget(creep:Creep, target:RoomPosition) {
        return true;
    }

    private getRampartsNear(pos:RoomPosition):Rampart[] {
        return pos.getArea<Rampart>("structure", 3, s => s.structureType == "rampart" && s.my);
    }
    private getRampartAt(pos:RoomPosition):Rampart {
        var structures = pos.lookFor<Rampart>("structure");
        return _.filter(structures, s => s.structureType == "rampart")[0];

    }
}

export = Defender;