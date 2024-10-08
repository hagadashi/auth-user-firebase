import { IsNotEmpty, IsObject } from "class-validator";
import { Roles } from "../roles/roles";

export class GrantRolesDto {

    @IsNotEmpty()
    userId: string;
    
    @IsObject()
    roles: Roles;
}