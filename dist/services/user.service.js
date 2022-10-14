"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleCorrected = exports.deleteUserById = exports.updateUserAnswer = exports.updateUserById = exports.getUserByEmail = exports.getUserByUsername = exports.getUserById = exports.queryUsers = exports.createUser = void 0;
const http_status_1 = __importDefault(require("http-status"));
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createUser = async (userBody) => {
    if (await models_1.User.isUsernameTaken(userBody.username)) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Username already taken');
    }
    return models_1.User.create(userBody);
};
exports.createUser = createUser;
const queryUsers = async (filter, options) => {
    const users = await models_1.User.paginate(filter, options);
    return users;
};
exports.queryUsers = queryUsers;
const getUserById = async (id) => {
    return models_1.User.findById(id);
};
exports.getUserById = getUserById;
const getUserByUsername = async (username) => {
    return models_1.User.findOne({ username });
};
exports.getUserByUsername = getUserByUsername;
const getUserByEmail = async (email) => {
    return models_1.User.findOne({ email });
};
exports.getUserByEmail = getUserByEmail;
const updateUserById = async (userId, updateBody) => {
    const user = await (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (updateBody.username &&
        (await models_1.User.isUsernameTaken(updateBody.username, userId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Username already taken');
    }
    Object.assign(user, updateBody);
    await user.save();
    return user;
};
exports.updateUserById = updateUserById;
const updateUserAnswer = async (userId, answerId, updateBody) => {
    const user = await (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const i = user.answers?.findIndex((answer) => answer.id.toString() === answerId);
    if (!i || user.answers === undefined) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Answer not found');
    }
    user.answers[i] = Object.assign(user.answers[i], updateBody);
    return user.save();
};
exports.updateUserAnswer = updateUserAnswer;
const deleteUserById = async (userId) => {
    const user = await (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    await user.remove();
    return user;
};
exports.deleteUserById = deleteUserById;
const toggleCorrected = async (userId) => {
    const user = await (0, exports.getUserById)(userId);
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    user.corrected = !user.corrected;
    await user.save();
};
exports.toggleCorrected = toggleCorrected;
const userService = {
    createUser: exports.createUser,
    queryUsers: exports.queryUsers,
    getUserById: exports.getUserById,
    getUserByUsername: exports.getUserByUsername,
    getUserByEmail: exports.getUserByEmail,
    updateUserById: exports.updateUserById,
    deleteUserById: exports.deleteUserById,
    toggleCorrected: exports.toggleCorrected,
};
exports.default = userService;
//# sourceMappingURL=user.service.js.map