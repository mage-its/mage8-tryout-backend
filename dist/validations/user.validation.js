"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
const createUser = {
    body: joi_1.default.object().keys({
        password: joi_1.default.string().required().custom(custom_validation_1.password),
        username: joi_1.default.string().required(),
        role: joi_1.default.string().required().valid('user', 'admin'),
        school: joi_1.default.string(),
    }),
};
const getUsers = {
    query: joi_1.default.object().keys({
        username: joi_1.default.string(),
        role: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const getUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const updateUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        password: joi_1.default.string().custom(custom_validation_1.password),
        username: joi_1.default.string(),
        school: joi_1.default.string(),
        corrected: joi_1.default.boolean(),
        role: joi_1.default.string().valid('user', 'admin'),
        score_1: joi_1.default.number(),
        score_2: joi_1.default.number(),
    })
        .min(1),
};
const updateUserAnswer = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
        answerId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        answer: joi_1.default.string(),
        round: joi_1.default.number(),
        verdict: joi_1.default.string().valid('CORRECT', 'INCORRECT'),
    })
        .min(1),
};
const deleteUser = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const toggleCorrected = {
    params: joi_1.default.object().keys({
        userId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
};
const userValidation = {
    createUser,
    getUsers,
    getUser,
    updateUser,
    updateUserAnswer,
    deleteUser,
    toggleCorrected,
};
exports.default = userValidation;
//# sourceMappingURL=user.validation.js.map