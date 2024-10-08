import { ForbiddenException } from "@nestjs/common";
import { RoleLevel, RoleNumber } from "./role-level.enum";
import { ClaimRoles, Role, Roles } from "./roles";

export class RolesManager {
    private _roles: Roles = {};

    /**
     * Construtor que inicializa o RolesManager com um conjunto de roles.
     * @param roles - Objeto JSON com roles no formato { "ENTITY": "ROLE" }
     */
    constructor(roles: any = {}) {
        if (!roles || !roles?.roles) {
            roles = RolesManager.new();
        }
        this._roles = this.convertRoles(this.fromClaim(roles));
    }

    /**
     * Retorna uma instancia inicial de Roles
     */
    public static new(): ClaimRoles {
        return {
            roles: {
                [Role.USER]: RoleLevel.READER,
            }
        };
    }

    /**
     * Retorna true quando o usuário possui acesso suficiente para atuar no nível informado
     * @param role - Role que será checado se o usuário tem acesso
     * @param level - Rolelevel esperado para que o usuário possa prosseguir.
     * @returns { status: boolean, message: string } - Retorna um objeto com status true quando com acesso, ou status false e message quando não possui
     */
    public canAccess(role: string, level: RoleLevel): { status: boolean, message?: string } {
        if (!role || !level) return { status: true };

        if (!this._roles[role]) return { status: false, message: `Access Denied: Requires ${role}` };

        const userLevel = RoleNumber[this._roles[role] as keyof typeof RoleNumber];
        const requiredLevel = RoleNumber[level as keyof typeof RoleNumber]; 

        if (userLevel > requiredLevel) 
            return { status: false, message: `Access Denied: Requires ${role} with ${level} role` };

        return { status: true };
    }

    /**
     * Método para atribuir uma role a uma entidade específica.
     * @param entity - Entidade para a qual a role será atribuída.
     * @param role - Role a ser atribuída à entidade.
     * @returns - Retorna o objeto atualizado com as roles.
     */
    public assignRole(role: string, level: RoleLevel): Roles {
        this._roles[role] = level;
        return this._roles;
    }

    /**
     * Método para atualizar a role de uma entidade.
     * @param entity - Entidade cuja role será atualizada.
     * @param role - Nova role a ser atribuída à entidade.
     * @returns - Retorna o objeto atualizado com as roles.
     */
    public updateRole(role: string, level: RoleLevel): Roles {
        if (this._roles[role] !== undefined) {
            this._roles[role] = level;
        } else {
            throw new Error(`Role ${role} não existe.`);
        }
        return this._roles;
    }

    /**
     * Método para remover a role de uma entidade.
     * @param role - Entidade cuja role será removida.
     * @returns - Retorna o objeto atualizado com as roles.
     */
    public removeRole(role: string): Roles {
        if (this._roles[role] !== undefined) {
            delete this._roles[role];
        } else {
            throw new Error(`Entidade ${role} não existe.`);
        }
        return this._roles;
    }

    /**
     * Método para aplicar roles e remover todas as demais.
     * @param roles - Roles que serão atribuídas.
     * @returns - Retorna o objeto atualizado com as roles.
     */
    public applyRoles(roles: Roles): Roles {
        const applyRoles = this.convertRoles(roles);
        this.clearRoles();
        for (const [entity, role] of Object.entries(applyRoles)) {
            if (this._roles[entity])
                this.updateRole(entity, role);
            else
                this.assignRole(entity, role);
        }
        return this.getRoles();
    }

    /**
     * Método para remover todas as roles.
     * @returns - Retorna o objeto de roles vazio.
     */
    public clearRoles(): Roles {
        this._roles = RolesManager.new().roles;
        return this._roles;
    }

    /**
     * Retorna todas as roles atribuídas.
     */
    public getRoles(): Roles {
        return Object.assign({}, this._roles);
    }

    /**
     * Retorna roles no formato Claim
     */
    public toClaim(): ClaimRoles {
        return { roles: this.getRoles() };
    }

    /**
     * Retorna Roles vindas de um Claim
     */
    private fromClaim(claims: ClaimRoles): Roles {
        return claims.roles;
    }

    /**
     * Converte o JSON inicial com strings para os valores do enum RoleLevel.
     * @param roles - Objeto com roles no formato { "ENTITY": "ROLE" }
     * @returns - Retorna um Roles atualizado.
     */
    public convertRoles(roles: object): Roles {
        const convertedRoles: Roles = {};

        for (const [entity, level] of Object.entries(roles)) {
            const roleLevel = RoleLevel[level as keyof typeof RoleLevel]; // Converte string para enum
            if (roleLevel !== undefined) {
                convertedRoles[entity] = roleLevel;
            } else {
                throw new Error(`Invalid access level: ${level}`);
            }
        }

        return convertedRoles;
    }
}