///<reference path="screeps-extended.d.ts"/>

class StatItem
{
    constructor(time, control, act, hang, no){
        this.time = time;
        this.realTime = new Date().toTimeString();
        this.control = control;
        this.act = act;
        this.hang = hang;
        this.no = no;
    }

    realTime;
    time;
    control;
    controlDelta;
    act;
    hang;
    no;

    static format(item:StatItem, delimiter:string = ' '):string {
        return [item.realTime, item.time, item.controlDelta, item.act, item.hang, item.no].join(delimiter);
    }

    static header(delimiter:string = ' '): string {
        return ["time", "ticks", "control", "act", "hang", "no"].join(delimiter);
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
            console.log(StatItem.header() + '\n' + StatItem.format(statItem));
        }
    }

    report(){
        var report = _.map(Memory.stats, (s:StatItem) => StatItem.format(s, '\t')).join('\n');
        return StatItem.header('\t') + '\n' + report;
    }
}

export var stats = new Stats(500);