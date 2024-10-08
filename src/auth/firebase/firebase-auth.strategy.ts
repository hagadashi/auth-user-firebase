import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import { auth } from 'firebase-admin';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy) {

    public static strategy = 'firebase-jwt';

    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(token: string): Promise<UserRecord> {
        try {
            const decodedIdToken = await auth().verifyIdToken(token, true);
            return await auth().getUser(decodedIdToken.uid);
        } catch (err) {
            console.log(err);
            throw new UnauthorizedException();
        }
    }

}