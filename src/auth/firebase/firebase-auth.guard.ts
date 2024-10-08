import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { FirebaseAuthStrategy } from "./firebase-auth.strategy";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class FirebaseAuthGuard extends AuthGuard(FirebaseAuthStrategy.strategy) implements CanActivate {

    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        // Verifica se a rota tem o decorator @Public()
        const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) {
            return true; // Permite acesso à rota anônima
        }

        return super.canActivate(context);
    }
}
