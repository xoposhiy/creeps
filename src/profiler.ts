///<reference path="screeps-extended.d.ts"/>

class Profiler{
    static wrapObj(obj, className, methodName) {
        obj.unwrapped[methodName] = obj[methodName];
        obj[methodName] = Profiler.profiled(obj[methodName], className + '.' + methodName);
    }

    static wrap(clazz, methodName) {
        Profiler.wrapObj(clazz.prototype, clazz.name, methodName);
    }

    static profiled(f, name){
        var stat = Memory.usedCpu[name] || { usage: 0, count: 0 };
        Memory.usedCpu[name] = stat;
        return function() {
            var time = Game.getUsedCpu();
            var result = f.apply(this, arguments);
            stat.usage += Game.getUsedCpu() - time;
            stat.count++;
            return result;
        };
    }

    static unwrapAll(clazz){
        if (!clazz.prototype.unwrapped) return;
        for(var name in clazz.prototype) {
            var m = clazz.prototype[name];
            if (_.isFunction(m) && _.isFunction(clazz.prototype.unwrapped[name])) {
                clazz.prototype[name] = clazz.prototype.unwrapped[name];
            }
        }
    }

    static wrapAll(clazz){
        clazz.prototype.unwrapped = {};
        for(var name in clazz.prototype) {
            var m = clazz.prototype[name];
            if (_.isFunction(m)) {
                Profiler.wrap(clazz, name);
            }
        }
    }

    static profilingTargets: any[] = [Room,RoomPosition,Creep,Structure,Spawn,Source,Energy,Flag,ConstructionSite];

    static start(){
        Memory.usedCpu = Memory.usedCpu || {};
        _.forEach(Profiler.profilingTargets, Profiler.wrapAll);
    }

    static stop(){
        _.forEach(Profiler.profilingTargets, Profiler.unwrapAll);
        var report = Profiler.report();
        Memory.usedCpu = {};
        return report;
    }

    static report(){
        for (var n in Memory.usedCpu) {
            var p = Memory.usedCpu[n];
            if (p.count === 0) {
                p.average = 0;
                continue;
            }
            p.average = p.usage / p.count;
        }
        var lines = [];
        for (n in Memory.usedCpu) {
            p = Memory.usedCpu[n];
            if (p.usage == 0) continue;
            lines.push({name: n, usage: p.usage, count: p.count, average: p.average});
        }
        lines = _.sortBy(lines, 'usage').reverse();
        return "name\tusage\tcount\taverage\n" +
            _.map(lines, line => _.values(line).join('\t')).join('\n');
    }

}
export = Profiler;