"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.refreshAuth = exports.logout = exports.loginUserWithEmailAndPassword = exports.loginUserWithUsernameAndPassword = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const redis_1 = require("../config/redis");
const tokens_1 = require("../config/tokens");
const token_model_1 = __importDefault(require("../models/token.model"));
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const token_service_1 = __importDefault(require("./token.service"));
const user_service_1 = __importDefault(require("./user.service"));
const loginUserWithUsernameAndPassword = async (username, password, ip) => {
    const user = await user_service_1.default.getUserByUsername(username);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect username or password');
    }
    if (config_1.default.ensureOneIp && user.role === 'user') {
        const redisUser = await redis_1.redis?.get(user.id);
        if (redisUser && ip !== redisUser) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Max login reached, please re-login');
        }
        await redis_1.redis?.set(user.id, ip, 'EX', 60 * 60 * 3);
    }
    const returnedUser = {
        ...user.toObject(),
    };
    delete returnedUser.score_1;
    delete returnedUser.score_2;
    delete returnedUser.password;
    returnedUser.answers = returnedUser.answers?.map((answer) => {
        const newAnswer = { ...answer };
        delete newAnswer.verdict;
        return newAnswer;
    });
    return returnedUser;
};
exports.loginUserWithUsernameAndPassword = loginUserWithUsernameAndPassword;
const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await user_service_1.default.getUserByEmail(email);
    if (!user || !(await user.isPasswordMatch(password))) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password');
    }
    const returnedUser = {
        ...user.toObject(),
    };
    delete returnedUser.score_1;
    delete returnedUser.score_2;
    returnedUser.answers = returnedUser.answers?.map((answer) => {
        const newAnswer = { ...answer };
        delete newAnswer.verdict;
        return newAnswer;
    });
    return returnedUser;
};
exports.loginUserWithEmailAndPassword = loginUserWithEmailAndPassword;
const logout = async (refreshToken) => {
    const refreshTokenDoc = await token_model_1.default.findOne({
        token: refreshToken,
        type: tokens_1.tokenTypes.REFRESH,
        blacklisted: false,
    });
    if (!refreshTokenDoc) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found');
    }
    await redis_1.redis?.del(refreshTokenDoc.user.toString());
    await refreshTokenDoc.remove();
};
exports.logout = logout;
const refreshAuth = async (refreshToken) => {
    try {
        const refreshTokenDoc = await token_service_1.default.verifyToken(refreshToken, tokens_1.tokenTypes.REFRESH);
        const user = await user_service_1.default.getUserById(refreshTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await refreshTokenDoc.remove();
        return token_service_1.default.generateAuthTokens(user);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Please authenticate');
    }
};
exports.refreshAuth = refreshAuth;
const resetPassword = async (resetPasswordToken, newPassword) => {
    try {
        const resetPasswordTokenDoc = await token_service_1.default.verifyToken(resetPasswordToken, tokens_1.tokenTypes.RESET_PASSWORD);
        const user = await user_service_1.default.getUserById(resetPasswordTokenDoc.user);
        if (!user) {
            throw new Error();
        }
        await user_service_1.default.updateUserById(user.id, { password: newPassword });
        await token_model_1.default.deleteMany({ user: user.id, type: tokens_1.tokenTypes.RESET_PASSWORD });
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Password reset failed');
    }
};
exports.resetPassword = resetPassword;
const authService = {
    loginUserWithUsernameAndPassword: exports.loginUserWithUsernameAndPassword,
    loginUserWithEmailAndPassword: exports.loginUserWithEmailAndPassword,
    logout: exports.logout,
    refreshAuth: exports.refreshAuth,
    resetPassword: exports.resetPassword,
};
exports.default = authService;
//# sourceMappingURL=auth.service.js.map