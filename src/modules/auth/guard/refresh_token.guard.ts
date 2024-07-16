import { AuthGuard } from "@nestjs/passport";

// Provides jwt based token authentication.

export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {}