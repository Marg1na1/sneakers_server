import { GoogleGuard } from './google.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesAuthGuard } from './role.guard';
export * from './role.guard';

export const GUARDS = [JwtAuthGuard, RolesAuthGuard, GoogleGuard];
