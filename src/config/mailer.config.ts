import { registerAs } from "@nestjs/config";

export default registerAs('mailer', () => ({
    emailService: process.env.EMAIL_SERVICE,
    senderEmail: process.env.SENDER_EMAIL,
    appPassword: process.env.APP_PASSWORD,
    serverUrl: process.env.SERVER_URL,
    emailHost: process.env.EMAIL_HOST,
}))