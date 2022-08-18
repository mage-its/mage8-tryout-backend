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

export const roles = Object.keys(allRoles);
export const roleRights = new Map(Object.entries(allRoles));

const rolesObject = {
  roles,
  roleRights,
};

export default rolesObject;
