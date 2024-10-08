import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../roles/roles.guard';
import { RoleLevel } from '../roles/role-level.enum';


export const RoleGuard = (role: string, level: RoleLevel) => 
  applyDecorators(
    SetMetadata('role', role),
    SetMetadata('level', level),
    UseGuards(RolesGuard)
  );
