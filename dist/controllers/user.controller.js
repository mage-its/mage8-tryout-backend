"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const services_1 = require("../services");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const pick_1 = __importDefault(require("../utils/pick"));
const createUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.createUser(req.body);
    res.status(http_status_1.default.CREATED).send(user);
});
const getUsers = (0, catchAsync_1.default)(async (req, res) => {
    const filter = (0, pick_1.default)(req.query, ['name', 'role']);
    const options = (0, pick_1.default)(req.query, ['sortBy', 'limit', 'page']);
    const result = await services_1.userService.queryUsers(filter, options);
    res.send(result);
});
const getUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.getUserById(req.params.userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    res.send(user);
});
const getUserAnswers = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.getUserById(req.user.id);
    const answers = user?.answers;
    res.send({ answers });
});
const updateUser = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.updateUserById(req.params.userId, req.body);
    res.send(user);
});
const updateUserAnswer = (0, catchAsync_1.default)(async (req, res) => {
    const user = await services_1.userService.updateUserAnswer(req.params.userId, req.params.answerId, req.body);
    res.send(user);
});
const deleteUser = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.userService.deleteUserById(req.params.userId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const toggleCorrected = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.userService.toggleCorrected(req.params.userId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const userController = {
    createUser,
    getUsers,
    getUser,
    getUserAnswers,
    updateUser,
    updateUserAnswer,
    deleteUser,
    toggleCorrected,
};
exports.default = userController;
//# sourceMappingURL=user.controller.js.map