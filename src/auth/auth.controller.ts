import { RoleLevel } from './roles/role-level.enum';
import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { SigninDto } from './dto/signin.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { GrantRolesDto } from './dto/grant-roles.dto';
import { Public } from './decorators/public.decorator';
import { RoleGuard } from './decorators/role-guard.decorator';
import { Role } from './roles/roles';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) { }

    @Post('signup')
    @Public()
    signUp(@Body() signupDto: SignupDto) {
        return this.authService.signup(signupDto);
    }

    @Post('signin')
    @Public()
    signIn(@Body() signinDto: SigninDto) {
        return this.authService.signin(signinDto);
    }

    @Put('grant-roles')
    @RoleGuard(Role.USER, RoleLevel.ADMIN)
    grantRoles(@Body() grantRolesDto: GrantRolesDto) {
        return this.authService.grantRoles(grantRolesDto);
    }

    @Get('me')
    @RoleGuard(Role.USER, RoleLevel.READER)
    me(@CurrentUser() user: any) {
        return user;
    }
}
