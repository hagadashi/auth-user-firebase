import { RoleLevel } from "./role-level.enum";

export type Roles = Record<string, RoleLevel>;
export type ClaimRoles = { roles: Roles };

export enum Role {
    USER = 'USER',
}