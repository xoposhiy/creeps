function loadRole(roleName){
    return require("role-" + roleName);
}

module.exports.load = loadRole;
