///<reference path="screeps-extended.d.ts"/>

class StatItem
{
    constructor(time, control, act, hang, no){
        this.time = time;
        this.control = control;
        this.act = act;
        this.hang = hang;
        this.no = no;
    }

    time;
    control;
    controlDelta;
    act;
    hang;
    no;

    static format(item:StatItem):string {
        return [item.time, item.control, item.controlDelta, item.act, item.hang, item.no].join(' ');
    }
}

class Stats{
    private timeFrame:number;

    constructor(timeFrame:number){
        this.timeFrame = timeFrame;
        if (!Memory.stats)
            Memory.stats = [];
    }

    onTick(){
        if (Game.time % this.timeFrame == 0)
        {
            var control = Game.gcl.progress;
            var statItem = new StatItem(Game.time, control, Memory.statsAct, Memory.statsHang, Memory.statsNo);
            Memory.statsAct = 0;
            Memory.statsHang = 0;
            Memory.statsNo = 0;
            var last = Memory.stats[Memory.stats.length-1] || statItem;
            statItem.controlDelta = control - last.control;
            Memory.stats.push(statItem);
            console.log("stat: " + StatItem.format(statItem));
        }
    }

    report(){
        var report = _.map(Memory.stats, StatItem.format).join('\n');
        return report;
    }
}

export var stats = new Stats(500);