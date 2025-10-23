import { registerAs } from "@nestjs/config";

export default registerAs('auth', () => ({
    secret: process.env.JWT_SECRET,
    expiresIn: parseInt(process.env.EXPIRES_IN ?? '86400'),
    refreshTokenExpiresIn: parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN ?? '86400')
}))