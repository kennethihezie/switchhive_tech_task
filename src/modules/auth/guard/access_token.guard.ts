import { AuthGuard } from "@nestjs/passport";

// Provides jwt based token authentication.

export class AccessTokenGuard extends AuthGuard('jwt') {}