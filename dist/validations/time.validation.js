"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
const createTime = {
    body: joi_1.default.object().keys({
        start: joi_1.default.number().required(),
        end: joi_1.default.number().required(),
        round: joi_1.default.number().required().valid(1, 2),
    }),
};
const getTimes = {
    query: joi_1.default.object().keys({
        round: joi_1.default.number().valid(1, 2),
        sortBy: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const getTime = {
    params: joi_1.default.object().keys({
        timeId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const updateTime = {
    params: joi_1.default.object().keys({
        timeId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        start: joi_1.default.number(),
        end: joi_1.default.number(),
        round: joi_1.default.number().valid(1, 2),
    })
        .min(1),
};
const deleteTime = {
    params: joi_1.default.object().keys({
        timeId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const timeValidation = {
    createTime,
    getTimes,
    getTime,
    updateTime,
    deleteTime,
};
exports.default = timeValidation;
//# sourceMappingURL=time.validation.js.map