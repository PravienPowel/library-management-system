import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';

// use it like @Roles('LIBRARIAN') to tag a route with the roles allowed
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);