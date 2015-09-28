///<reference path="screeps-extended.d.ts"/>
/**
 * Debug functions for screeps.com console.
 *
 * ## How to use?
 *
 * In main.js:
 * require('debug').populate(global);
 *
 * In screeps.com console:
 * > o(name_of_your_creep | id_of_structure | room_name | flag_name | id_of_some_object | role_of_creep)
 *
 * gives you the object which represents creep | structure | room | flag | object | creeps with that value of memory.role.
 *
 * > s(what)
 *
 * gives you json representation of o(what) || what.
 *
 * > m(what)
 *
 * gives you json representation of specified objects memory
 *
 * ## Usage sample:
 *
 * > o('creep_john').memory.role = 'harvester';
 *
 * > o('creep_john').transferEnergy(o('5606b62e2d246b9e31100fb1'))
 */

function pretty(k, v) {
    if (k == 'body') return _.map(v, 'type').join(',');
    if (v && v.x != undefined && v.y != undefined && v.roomName != undefined)
        return v === undefined ? 'undefined' : v.toString();
    return v;
}

function o(what:string) {
    if (what == '') return _.values(Game.creeps)[0];
    return Game.getObjectById(what) || Game.creeps[what] || Game.flags[what] || Game.rooms[what]
        || _.filter(Game.creeps, c => c.memory.role == what);
}

function s(what:any) {
    var object = (typeof what == "string") ? o(what) : what;
    if (object === undefined) return 'null';
    return JSON.stringify(object, pretty, ' ');
}

function m(what:any, index?:number) {
    var obj = o(what);
    if (_.isArray(obj)) obj = obj[index || 0];
    return s(obj['memory']);
}

function r(what:any, roleName:string){
    var obj = o(what);
    if (!_.isArray(obj)) obj = [obj];
    _.forEach(obj, o => {
        o['memory'] = {role: roleName};
        console.log(o + ' set to role ' + roleName);
    });
}

export function populate(g){
    g.o = o;
    g.s = s;
    g.m = m;
    g.r = r;
}
