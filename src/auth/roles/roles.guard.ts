
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesManager } from './roles-manager';
import { RoleLevel } from './role-level.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<string>('role', context.getHandler());
    const level = this.reflector.get<RoleLevel>('level', context.getHandler());

    if (!role || !level) {
      return true; // Se não tiver roles específicas, permite o acesso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.customClaims || !user.customClaims.roles) {
      throw new ForbiddenException('Access Denied');
    }

    const roleManager = new RolesManager(user.customClaims);
    const access = roleManager.canAccess(role, level);

    if (!access.status) {
        throw new ForbiddenException(access.message);
      }

    return access.status;
  }
}
