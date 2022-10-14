"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const services_1 = require("../services");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const register = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.createUser(req.body);
    const tokens = await services_1.tokenService.generateAuthTokens(user);
    res.status(http_status_1.default.CREATED).send({ user, tokens });
});
const login = (0, catchAsync_1.default)(async (req, res) => {
    const { username, password } = req.body;
    const user = await services_1.authService.loginUserWithUsernameAndPassword(username, password, req.ip);
    const tokens = await services_1.tokenService.generateAuthTokens(user);
    res.send({ user, tokens });
});
const logout = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.authService.logout(req.body.refreshToken);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const refreshTokens = (0, catchAsync_1.default)(async (req, res) => {
    const tokens = await services_1.authService.refreshAuth(req.body.refreshToken);
    res.send({ ...tokens });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    const resetPasswordToken = await services_1.tokenService.generateResetPasswordToken(req.body.email);
    await services_1.emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.authService.resetPassword(req.query.token, req.body.password);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const authController = {
    register,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
};
exports.default = authController;
//# sourceMappingURL=auth.controller.js.map