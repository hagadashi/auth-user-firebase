import { Injectable, OnApplicationBootstrap } from "@nestjs/common";

import * as firebaseClient from "firebase/app";
import { signInWithEmailAndPassword, getAuth, sendPasswordResetEmail, Auth, UserCredential, ActionCodeSettings } from 'firebase/auth'

@Injectable()
export class FirebaseClient implements OnApplicationBootstrap {

    private static app: firebaseClient.FirebaseApp;

    async onApplicationBootstrap() {
        if (!FirebaseClient.app) {
            const firebaseConfig = JSON.parse(process.env.FIREBASECLIENT);
            FirebaseClient.app = firebaseClient.initializeApp(firebaseConfig);
        }
    }

    setup(): firebaseClient.FirebaseApp {
        return FirebaseClient.app;
    }

    getAuth(): Auth {
        return getAuth(FirebaseClient.app)
    }

    signInWithEmailAndPassword(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.getAuth(), email, password);
    }

    sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings): Promise<void> {
        return sendPasswordResetEmail(this.getAuth(), email, actionCodeSettings);
    }

}
