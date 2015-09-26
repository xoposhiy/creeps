///<reference path="screeps-extended.d.ts"/>

import Profiler = require('profiler');
import roleLoader = require("jsRoleLoader");

var allRoles = ['builder', 'cargo', 'harvester', 'hungry', 'no', 'reservator', 'returner', 'upgrader', 'scout'];

var roles = {
    impl: _.zipObject(_.map(allRoles, r => [r, roleLoader['load'](r)])),
    assignNewRole: assignNewRole,
    getCreepsByRole: getCreepsByRole
};

function getCreepsByRole(){
    var creeps = _.values(Game.creeps);
    var res = _.map(allRoles, r => [r, _.filter(creeps, (c: Creep) => c.memory && c.memory.role == r)]);
    return _.zipObject(res);
}

/** @param {Creep} creep
 * @param {Boolean} finished
 */
function assignNewRole(creep, finished) {
    var oldRole = creep.memory.role;
    creep.memory = {};
    var newRole = getNewRole(creep);
    console.log(Game.time + " ROLE " + _.padLeft(oldRole, 12) + " -> " + _.padRight(newRole, 12) +
        " " + creep + " " + creep.pos +
        (finished ? "" : " TIMEOUT"));
    creep.say("!" + newRole);
    creep.memory = { role: newRole };
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
        creeps[role].length < maxCreepsThisRole &&
        roles.impl[role].fits(creep)) ?
            role : undefined;
    };
    var constructionSites = creep.room.find(FIND_CONSTRUCTION_SITES).length;
    return (
        tryRole('harvester') ||
        tryRole('builder', constructionSites/2 + 1) ||
        tryRole('upgrader') ||
        tryRole('cargo', 3) ||
        tryRole('hungry') ||
        tryRole('returner') ||
        tryRole('reservator') ||
        tryRole('scout') ||
        'no'
    );
}

export = roles;
