import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import * as firebaseAdmin from "firebase-admin";

@Injectable()
export class FirebaseAdmin implements OnApplicationBootstrap {

    private static app: firebaseAdmin.app.App;

    async onApplicationBootstrap() {
        if (!FirebaseAdmin.app) {
            const serviceAccount = JSON.parse(process.env.FIREBASEADMIN);
            
            FirebaseAdmin.app = firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert({ ...serviceAccount })
            });
        }
    }

    setup() {
        return FirebaseAdmin.app;
    }
}