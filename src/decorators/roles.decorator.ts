import { Reflector } from "@nestjs/core";

export const Roles = Reflector.createDecorator<string[]>();

export const matchRoles = (userRoles: string[], requiredRoles: string[]) : boolean => {
    return userRoles.some(role => requiredRoles.includes(role));
}

// truong hop 1 user 1 role
// export const matchRole = (userRole: string, requiredRoles: string[]) : boolean => {
//     return requiredRoles.includes(userRole);
// }