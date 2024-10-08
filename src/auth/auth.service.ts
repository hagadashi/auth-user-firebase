import { GrantRolesDto } from './dto/grant-roles.dto';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { FirebaseAdmin } from './firebase/firebase-admin.setup';
import { FirebaseClient } from './firebase/firebase-client.setup';
import { SigninDto } from './dto/signin.dto';
import { IdTokenResult } from 'firebase/auth';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { RolesManager } from './roles/roles-manager';

@Injectable()
export class AuthService {

    constructor(
        private readonly firebaseAdmin: FirebaseAdmin,
        private readonly firebaseClient: FirebaseClient,
    ) { }

    async signup(signupDto: SignupDto): Promise<UserRecord> {

        const { email, password, firstName, lastName } = signupDto;
        const app = this.firebaseAdmin.setup();

        try {
            const createdAuthentication = await app.auth().createUser({
                email,
                password,
                displayName: `${firstName} ${lastName}`,
            });
            await app.auth().setCustomUserClaims(createdAuthentication.uid, RolesManager.new());

            return createdAuthentication;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async signin(signinDto: SigninDto): Promise<IdTokenResult> {
        try {
            const userCredential = await this.firebaseClient.signInWithEmailAndPassword(signinDto.email, signinDto.password);
            return await userCredential.user.getIdTokenResult();
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    async grantRoles(grantRoles: GrantRolesDto): Promise<void> {        
        const app = this.firebaseAdmin.setup();

        try {            
            const user = await app.auth().getUser(grantRoles.userId);
            const rolesManager = new RolesManager(user.customClaims);    
    
            rolesManager.applyRoles(grantRoles.roles);
            await app.auth().setCustomUserClaims(user.uid, rolesManager.toClaim());
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

}