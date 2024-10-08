import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { FirebaseAdmin } from './firebase/firebase-admin.setup';
import { FirebaseClient } from './firebase/firebase-client.setup';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthStrategy } from './firebase/firebase-auth.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: FirebaseAuthStrategy.strategy })
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    FirebaseAdmin,
    FirebaseClient,
    FirebaseAuthStrategy,
  ],
  exports: [
    PassportModule
  ]
})
export class AuthModule { }
