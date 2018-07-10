///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import Role = require('Role');

var allRoles = [
    'no',
    'builder', 'upgrader', 'cargo', 'harvester',
    'hungry', 'reservator',
    'transport',
    'returner', 'scout',
    'upper',
    'claimer', 'flag',
    'ranger',  'retreater', 'soldier', 'warrior', 'healer', 'defender', 'tank'
];

var req = function(module){
    return eval("require('" + module + "')");
};

function loadRole(roleName){
    var roleClass = req('role-' + roleName);
    Profiler.wrapAll(roleClass);
    return new roleClass();
}
var roles = {
    impl: _.zipObject(_.map(allRoles, r => [r, loadRole(r)])),
    implClass: _.zipObject(_.map(allRoles, r => [r, req('role-' + r)])),
    assignNewRole: assignNewRole,
    getCreepsByRole: getCreepsByRole
};

function getCreepsByRole(role?:string){
    if (role)
        return getCreepsByRole()[role];
    var creeps = _.values(Game.creeps);
    var res = _.map(allRoles, r => [r, _.filter(creeps, (c: Creep) => c.memory && c.memory.role == r)]);
    return _.zipObject(res);
}

/** @param {Creep} creep
 * @param {Boolean} finished
 */
function assignNewRole(creep:Creep, finished:boolean): Role {
    var oldRole = creep.memory.role;
    creep.memory = {};
    var newRole = getNewRole(creep);
    if (Memory.debug[creep.name])
    {
        var message = Game.time + " ROLE " + _.padLeft(oldRole, 12) + " -> " + _.padRight(newRole, 12) +
            " " + creep + " " + creep.pos +
            (finished ? "" : " TIMEOUT");
        console.log(message);
    }
    creep.say("!" + newRole);
    creep.memory = { role: newRole };
    return creep.getRole();
}

/** @param {Creep} creep */
function getNewRole(creep){
    var creeps = getCreepsByRole();
    var tryRole = (role:string, maxCreepsThisRole?:number, totalCreeps?:number) =>
    {
        maxCreepsThisRole = maxCreepsThisRole || 100500;
        totalCreeps = totalCreeps || 0;
        if (!creeps[role]) console.log("unknown " + role);
        return (_.values(Game.creeps).length >= totalCreeps &&
            _.filter(creeps[role], (c:Creep) => c.longMemory().roomName == creep.longMemory().roomName).length < maxCreepsThisRole &&
            roles.impl[role].fits(creep)) ?
                role : undefined;
    };

    var oneOf = (...roleNames:string[]) => {
        var t = Game.time;
        for(var i = 0; i<roleNames.length; i++) {
            var res = tryRole(roleNames[(i + t) % roleNames.length]);
            if (res) return res;
        }
        return undefined;
    };

    var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES).length;
    return (
        tryRole('flag') ||
        //tryRole('retreater') ||
        //tryRole('warrior') ||
        tryRole('defender') ||
        tryRole('healer') ||
        tryRole('soldier') ||
        tryRole('tank') ||
        tryRole('ranger') ||
        //no energy:
        tryRole('upper') ||
        tryRole('harvester', 2) ||
        tryRole('transport', 2) ||
        tryRole('harvester') ||
        tryRole('transport') ||
        //tryRole('scout') ||
        // has energy:
        tryRole('reservator', 2) ||
        tryRole('builder', 1) ||
        tryRole('upgrader', 1) ||
        tryRole('builder', Math.min(4, constructionSites + 2)) ||
        tryRole('upgrader') ||
        tryRole('reservator', 4) ||
        //tryRole('cargo', 2) ||
        tryRole('builder') ||
        tryRole('reservator') ||
        tryRole('returner') ||
        'no'
    );
}

export = roles;
