import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // read which roles the route allows (set by @Roles)
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // no @Roles on the route means anyone can use it
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // req.user was filled in by the JwtStrategy
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { role: string } }>();
    const user = request.user;

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You do not have permission to do this');
    }
    return true;
  }
}