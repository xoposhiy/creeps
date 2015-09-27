///<reference path="screeps-extended.d.ts"/>
import roles = require('roles');

function pretty(k, v) {
    if (k == 'body') return _.map(v, 'type').join(',');
    if (k == 'pos' || k == 'targetPosition' || k == 'rawTarget') return v ? v.toString() : 'undefined';
    return v;
}

export function populate(g){
    g.c = function (role) {
        var creep = <Creep>_.values(Game.creeps)[0];
        if (role) creep = creep.getCreepsByRole()[role][0];
        return creep;
    };
    g.o = function (id:string) {
        if (id == '') return _.values(Game.creeps)[0];
        return Game.getObjectById(id) || Game.creeps[id] || Game.flags[id] || Game.rooms[id]
            || roles.getCreepsByRole(id)[0];
    };
    g.s = function (what:any, space?:string) {
        var object = (what instanceof String) ? global.o(what) : what;
        if (!object) return 'null';
        return JSON.stringify(object, pretty, space);
    };
    g.r = function (role:string) {
        return roles.implClass[role].prototype;
    }

}