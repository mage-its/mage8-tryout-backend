"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = exports.sendResetPasswordEmail = exports.sendEmail = exports.transport = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = __importDefault(require("../config/logger"));
exports.transport = nodemailer_1.default.createTransport(config_1.default.email.smtp);
/* istanbul ignore next */
if (config_1.default.env !== 'test') {
    exports.transport
        .verify()
        .then(() => logger_1.default.info('Connected to email server'))
        .catch(() => logger_1.default.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}
const sendEmail = async (to, subject, text) => {
    const msg = { from: config_1.default.email.from, to, subject, text };
    await exports.transport.sendMail(msg);
};
exports.sendEmail = sendEmail;
const sendResetPasswordEmail = async (to, token) => {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await (0, exports.sendEmail)(to, subject, text);
};
exports.sendResetPasswordEmail = sendResetPasswordEmail;
const sendVerificationEmail = async (to, token) => {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await (0, exports.sendEmail)(to, subject, text);
};
exports.sendVerificationEmail = sendVerificationEmail;
const emailService = {
    transport: exports.transport,
    sendEmail: exports.sendEmail,
    sendResetPasswordEmail: exports.sendResetPasswordEmail,
    sendVerificationEmail: exports.sendVerificationEmail,
};
exports.default = emailService;
//# sourceMappingURL=email.service.js.map