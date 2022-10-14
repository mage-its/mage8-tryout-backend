"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerifyEmailToken = exports.generateResetPasswordToken = exports.generateAuthTokens = exports.verifyToken = exports.saveToken = exports.generateToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const config_1 = __importDefault(require("../config/config"));
const tokens_1 = require("../config/tokens");
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const user_service_1 = __importDefault(require("./user.service"));
const generateToken = (userId, expires, type, secret = config_1.default.jwt.secret) => {
    const payload = {
        sub: userId,
        iat: (0, moment_1.default)().unix(),
        exp: expires.unix(),
        type,
    };
    return jsonwebtoken_1.default.sign(payload, secret);
};
exports.generateToken = generateToken;
const saveToken = async (token, userId, expires, type, blacklisted = false) => {
    const tokenDoc = await models_1.Token.create({
        token,
        user: userId,
        expires: expires.toDate(),
        type,
        blacklisted,
    });
    return tokenDoc;
};
exports.saveToken = saveToken;
const verifyToken = async (token, type) => {
    const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.secret);
    const tokenDoc = await models_1.Token.findOne({
        token,
        type,
        user: payload.sub,
        blacklisted: false,
    });
    if (!tokenDoc) {
        throw new Error('Token not found');
    }
    return tokenDoc;
};
exports.verifyToken = verifyToken;
const generateAuthTokens = async (user) => {
    const accessTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.accessExpirationMinutes, 'minutes');
    const accessToken = (0, exports.generateToken)(user.id ?? user._id, accessTokenExpires, tokens_1.tokenTypes.ACCESS);
    const refreshTokenExpires = (0, moment_1.default)().add(config_1.default.jwt.refreshExpirationDays, 'days');
    const refreshToken = (0, exports.generateToken)(user.id ?? user._id, refreshTokenExpires, tokens_1.tokenTypes.REFRESH);
    await (0, exports.saveToken)(refreshToken, user.id ?? user._id, refreshTokenExpires, tokens_1.tokenTypes.REFRESH);
    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate(),
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate(),
        },
    };
};
exports.generateAuthTokens = generateAuthTokens;
const generateResetPasswordToken = async (email) => {
    const user = await user_service_1.default.getUserByEmail(email);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'No users found with this email');
    }
    const expires = (0, moment_1.default)().add(config_1.default.jwt.resetPasswordExpirationMinutes, 'minutes');
    const resetPasswordToken = (0, exports.generateToken)(user.id ?? user._id, expires, tokens_1.tokenTypes.RESET_PASSWORD);
    await (0, exports.saveToken)(resetPasswordToken, user.id ?? user._id, expires, tokens_1.tokenTypes.RESET_PASSWORD);
    return resetPasswordToken;
};
exports.generateResetPasswordToken = generateResetPasswordToken;
const generateVerifyEmailToken = async (user) => {
    const expires = (0, moment_1.default)().add(config_1.default.jwt.verifyEmailExpirationMinutes, 'minutes');
    const verifyEmailToken = (0, exports.generateToken)(user.id ?? user._id, expires, tokens_1.tokenTypes.VERIFY_EMAIL);
    await (0, exports.saveToken)(verifyEmailToken, user.id ?? user._id, expires, tokens_1.tokenTypes.VERIFY_EMAIL);
    return verifyEmailToken;
};
exports.generateVerifyEmailToken = generateVerifyEmailToken;
const tokenService = {
    generateToken: exports.generateToken,
    saveToken: exports.saveToken,
    verifyToken: exports.verifyToken,
    generateAuthTokens: exports.generateAuthTokens,
    generateResetPasswordToken: exports.generateResetPasswordToken,
    generateVerifyEmailToken: exports.generateVerifyEmailToken,
};
exports.default = tokenService;
//# sourceMappingURL=token.service.js.map