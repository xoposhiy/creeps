import Role = require('Role');


class Miner extends Role {

    fits(creep:Creep):boolean {
        return creep.getActiveBodyparts(WORK) == 6 &&
            Miner.getFreeMineFlags(creep.room).length > 0;
    }

    finished(creep:Creep):boolean {
        return creep.bodyScore([WORK]) == 0;
    }

    run(creep:Creep):boolean {
        //if (creep.fatigue > 0) return true;
        var target:Flag = Miner.getTargetFlag(creep) || Miner.selectTargetFlag(creep);
        if (!target){
            console.log("no miner flags!");
            return false;
        }
        if (target.pos.isNearTo(creep.pos)) {
            creep.harvest(Miner.getSource(target));
        }
        else {
            creep.moveTo(target);
        }
        return true;
    }

    static getBody() {
        return [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK];
    }
    static getBodyCost() {
        return 1000;
    }

    static mineIsFree(f:Flag):boolean {
        return !this.getMiner(f);
    }

    static getSource(f:Flag):Source {
        var source = <Source>f.room.lookForAt("source", f.pos)[0];
        if (!source) {
            console.log("flag " + f + " should be on source!");
            return null;
        }
        return source;
    }

    static getMiner(f:Flag):Creep {
        var minerId = f.memory['minerId'] || "NA";
        var miner = <Creep>Game.getObjectById(minerId);
        if (!miner) {
            f.memory['minerId'] = undefined;
            return null;
        }
        if (miner.memory.targetId != f.id) {
            miner.memory.targetId = undefined;
            return null;
        }
        return miner;
    }

    static getSpawnDistance(f:Flag) {
        if (!f.memory['distanceToSpawn'] || !Game.getObjectById(f.memory['spawnId'])) {
            var spawn = <Spawn>f.pos.findClosestByPath(FIND_MY_SPAWNS);
            var path = spawn.pos.findPathTo(f);
            f.memory['distanceToSpawn'] = path.length;
            f.memory['spawnId'] = spawn.id;
        }
        return f.memory['distanceToSpawn'];
    }

    static assignMiner(miner:Creep, mineFlag:Flag) {
        miner.memory.targetId = mineFlag.id;
        mineFlag.memory["minerId"] = miner.id;
    }

    static getTargetFlag(creep:Creep):Flag {
        var fId = creep.memory.targetId || "NA";
        var flag = <Flag>Game.getObjectById(fId);
        return flag;
    }

    static getFreeMineFlags(room:Room){
        return room.find(FIND_FLAGS,
            {filter: (f:Flag) => f.color == COLOR_YELLOW && _.startsWith(f.name, "mine") && this.mineIsFree(f)});

    }
    static selectTargetFlag(creep:Creep):Flag {
        var mineFlags = this.getFreeMineFlags(creep.room);
        var mineFlag = <Flag>creep.pos.findClosestByPath(mineFlags);
        if (mineFlag)
            this.assignMiner(creep, mineFlag);
        return mineFlag;
    }

    static wantMiner(spawn:Spawn, maxEnergy:number, workCount:number):boolean {
        if (workCount <= 1) {
            console.log('no miner if workCount = ' + workCount);
            return false;
        }
        if (maxEnergy < Miner.getBodyCost()) {
            console.log('no miner if maxEnergy = ' + maxEnergy);
            return false;
        }
        var freeMines = Miner.getFreeMineFlags(spawn.room).length;
        console.log('free mines in ' + spawn  + " = " + freeMines);
        return freeMines != 0;
    }
}

export = Miner;