import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class UserSpecificRoutesGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const userId = request.params.id;
        const user = request['user'];

        if(user.role === 'admin' || (user.role === 'user' && user.id === userId)) {
            return true;
        }

        return false;
    }
}
