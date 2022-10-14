"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleRights = exports.roles = void 0;
const allRoles = {
    user: [],
    admin: [
        'getUsers',
        'manageUsers',
        'getSoals',
        'manageSoals',
        'getTime',
        'manageTime',
    ],
};
exports.roles = Object.keys(allRoles);
exports.roleRights = new Map(Object.entries(allRoles));
const rolesObject = {
    roles: exports.roles,
    roleRights: exports.roleRights,
};
exports.default = rolesObject;
//# sourceMappingURL=roles.js.map