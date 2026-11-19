import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// put @UseGuards(JwtAuthGuard) on a route to require a valid token
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}