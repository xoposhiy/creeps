///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import Role = require('Role');

var allRoles = [
    'no', 'builder', 'cargo', 'harvester', 'hungry', 'reservator', 'returner', 'upgrader', 'scout',
    'claimer', 'flag', 'ranger', 'warrior', 'healer'
];

function loadRole(roleName){
    var roleClass = global['require']('role-' + roleName);
    //Profiler.wrapAll(roleClass);
    return new roleClass();
}
var roles = {
    impl: _.zipObject(_.map(allRoles, r => [r, loadRole(r)])),
    implClass: _.zipObject(_.map(allRoles, r => [r, global['require']('role-' + r)])),
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
            _.filter(creeps[role], (c:Creep) => c.room.name == creep.room.name).length < maxCreepsThisRole &&
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
        tryRole('warrior') ||
        tryRole('healer') ||
      //tryRole('ranger') ||
        //no energy:
        tryRole('harvester') ||
        oneOf('hungry', 'scout') ||
        // has energy:
        tryRole('returner') ||
        tryRole('builder', constructionSites + 2) ||
        tryRole('upgrader') ||
        tryRole('cargo', 3) || //TODO remove constant. How?!
        tryRole('reservator') ||
        tryRole('builder') ||
        'no'
    );
}

export = roles;
