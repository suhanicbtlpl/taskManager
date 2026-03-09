const permissionMap = {
  "VIEW_STAFF": ["CREATE_STAFF", "UPDATE_STAFF", "DELETE_STAFF"],
  "VIEW_ROLE": ["CREATE_ROLE", "UPDATE_ROLE", "DELETE_ROLE"],
  "VIEW_PERMISSION": ["CREATE_PERMISSION", "UPDATE_PERMISSION", "DELETE_PERMISSION"],
  "VIEW_TASK": ["CREATE_TASK", "UPDATE_TASK", "DELETE_TASK"],
  "VIEW_PROJECT": ["CREATE_PROJECT", "UPDATE_PROJECT", "DELETE_PROJECT"],
  "VIEW_DOCUMENT": ["CREATE_DOCUMENT","UPDATE_DOCUMENT","DELETE_DOCUMENT","APPROVE_DOCUMENT"]
};

export const hasPermission = (user, requiredPermission) => {
  if (!user || !user.permissions) {
    return false;
  }

  // Direct check
  if (user.permissions.includes(requiredPermission)) return true;

  // Implied check (e.g., if user has CREATE_STAFF, they can VIEW_STAFF)
  const impliedBy = permissionMap[requiredPermission] || [];
  return impliedBy.some(p => user.permissions.includes(p));
};