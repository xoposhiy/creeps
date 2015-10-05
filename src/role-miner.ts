import Role = require('Role');


class Miner extends Role {

    static getBody(maxEnergy:number) {
        var workSegment = Creep.makeBody(100500, [WORK], 6, [MOVE, CARRY]);
        var carryEnergy = Math.max(0, maxEnergy - Creep.bodyCost(workSegment));
        return workSegment.concat(Creep.makeBody(carryEnergy, [CARRY], 6));
    }

    fits(creep:Creep):boolean {
        return creep.getActiveBodyparts(WORK) == 6 &&
            !creep.room.forbidden() &&
            Miner.getFreeMineFlags(creep.room).length > 0;
    }

    finished(creep:Creep):boolean {
        return creep.bodyScore([WORK]) == 0;
    }

    run(creep:Creep):boolean {
        var target:Flag = Miner.getTargetFlag(creep) || Miner.selectTargetFlag(creep);
        if (!target){
            console.log("no miner flags!");
            return false;
        }
        Miner.assignMiner(creep, target);
        if (target.pos.isNearTo(creep.pos)) {
            creep.harvest(Miner.getSource(target));
        }
        else {
            if (target.pos.getRangeTo(creep.pos) <= 3)
                target.pos.getAssignedCreeps().forEach(id => {
                    if (id != creep.id)
                        (<Creep>Game.getObjectById(id)).assignNewRole(true);
                });
            creep.moveTo(target);
        }
        return true;
    }

    static getTargetFlag(creep:Creep):Flag {
        var fId = creep.memory.targetId || "NA";
        var flag = <Flag>Game.getObjectById(fId);
        if (!flag) return undefined;
        if (!Game.flags[flag.name]) return undefined;
        var miner = Miner.getMiner(flag);
        if (miner && miner.id != creep.id) return undefined;
        return flag;
    }

    static getMiner(f:Flag):Creep {
        if (!f.memory){
            Game.notify("flag " + f + " memory is undefined.\n" + new Error()['stack'], 1);
            return undefined;
        }
        var minerId = f.memory['minerId'] || "NA";
        var miner = <Creep>Game.getObjectById(minerId);
        if (!miner) {
            f.memory['minerId'] = undefined;
            return undefined;
        }
        if (miner.memory.targetId != f.id) {
            miner.memory.targetId = undefined;
            f.memory['minerId'] = undefined;
            return undefined;
        }
        return miner;
    }

    static selectTargetFlag(creep:Creep):Flag {
        var mineFlags = this.getFreeMineFlags(creep.room);
        var mineFlag = <Flag>creep.pos.findClosestByPath(mineFlags);
        if (mineFlag){
            if (mineFlag instanceof Flag) {
                this.assignMiner(creep, mineFlag);
                return mineFlag;
            }
            else{
                var message = "mine flags: " + mineFlags + " closest: " + mineFlag;
                Game.notify(message, 1);
            }
        }
        return undefined;
    }

    static getFreeMineFlags(room:Room):Flag[]{

        return <Flag[]>room.find(FIND_FLAGS, {filter: f => Miner.isMineFlag(f) && this.mineIsFree(f)});
    }

    static isMineFlag(f:Flag):boolean{
        return f.color == COLOR_YELLOW && _.startsWith(f.name, "mine");
    }

    static mineIsFree(f:Flag):boolean {
        return !this.getMiner(f);
    }

    static getSource(f:Flag):Source {
        var source = <Source>f.room.lookForAt("source", f.pos)[0];
        if (!source) {
            console.log("flag " + f + " should be on source!");
            return undefined;
        }
        return source;
    }

    static assignMiner(miner:Creep, mineFlag:Flag) {
        if (!(mineFlag instanceof Flag)){
            Game.notify(mineFlag + " " + new Error()['stack'], 1);
            return;
        }
        var oldMiner = Miner.getMiner(mineFlag);
        if (oldMiner && oldMiner.id != miner.id)
            oldMiner.assignNewRole(false);
        miner.memory.targetId = mineFlag.id;
        mineFlag.memory["minerId"] = miner.id;
    }

    static posIsFree(pos:RoomPosition):boolean {
        var f = _.filter(<Flag[]>pos.lookFor("flag"), f => Miner.isMineFlag(f))[0];
        return !f || Miner.mineIsFree(f);
    }

    static wantMiner(spawn:Spawn, maxEnergy:number):boolean {
        if (maxEnergy < Creep.bodyCost(Miner.getBody(maxEnergy))) {
            return false;
        }
        var freeMines = Miner.getFreeMineFlags(spawn.room).length;
        return freeMines != 0;
    }
}

export = Miner;