"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
const createSoal = {
    body: joi_1.default.object().keys({
        question: joi_1.default.string().required(),
        multipleChoice: joi_1.default.array().items(joi_1.default.string()),
        type: joi_1.default.string().required(),
        difficulty: joi_1.default.string().required(),
        school: joi_1.default.string().required(),
        round: joi_1.default.number().required(),
        answer: joi_1.default.string().required(),
    }),
};
const userAnswer = {
    body: joi_1.default.object().keys({
        soalId: joi_1.default.string().required(),
        answer: joi_1.default.string().min(1),
    }),
};
const getSoals = {
    query: joi_1.default.object().keys({
        type: joi_1.default.string(),
        school: joi_1.default.string(),
        difficulty: joi_1.default.string(),
        round: joi_1.default.number(),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const getSoal = {
    params: joi_1.default.object().keys({
        soalId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const updateSoal = {
    params: joi_1.default.object().keys({
        soalId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        question: joi_1.default.string(),
        multipleChoice: joi_1.default.array().items(joi_1.default.string()),
        type: joi_1.default.string(),
        difficulty: joi_1.default.string(),
        school: joi_1.default.string(),
        round: joi_1.default.number(),
        answer: joi_1.default.string(),
    })
        .min(1),
};
const deleteSoal = {
    params: joi_1.default.object().keys({
        soalId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const soalValidation = {
    createSoal,
    userAnswer,
    getSoals,
    getSoal,
    updateSoal,
    deleteSoal,
};
exports.default = soalValidation;
//# sourceMappingURL=soal.validation.js.map