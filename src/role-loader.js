function loadRole(roleName){
    var Role = require("role-" + roleName);
    return new Role();
}

module.exports.load = loadRole;
