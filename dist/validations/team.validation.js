"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const custom_validation_1 = require("./custom.validation");
const register = {
    body: joi_1.default.object().keys({
        user1: joi_1.default.object().keys({
            password: joi_1.default.string().required().custom(custom_validation_1.password),
            username: joi_1.default.string().required(),
            school: joi_1.default.string(),
        }),
        user2: joi_1.default.object().keys({
            password: joi_1.default.string().required().custom(custom_validation_1.password),
            username: joi_1.default.string().required(),
            school: joi_1.default.string(),
        }),
        user3: joi_1.default.object().keys({
            password: joi_1.default.string().required().custom(custom_validation_1.password),
            username: joi_1.default.string().required(),
            school: joi_1.default.string(),
        }),
        team: joi_1.default.object().keys({
            name: joi_1.default.string().required(),
            phone: joi_1.default.string().required(),
            school: joi_1.default.string().required(),
            email: joi_1.default.string().required(),
            schoolType: joi_1.default.string().required(),
        }),
    }),
};
const getTeamByName = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string().required(),
    }),
};
const getTeamById = {
    params: joi_1.default.object().keys({
        teamId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const getTeams = {
    query: joi_1.default.object().keys({
        name: joi_1.default.string(),
        school: joi_1.default.string(),
        sortBy: joi_1.default.string(),
        schoolType: joi_1.default.string(),
        limit: joi_1.default.number().integer(),
        page: joi_1.default.number().integer(),
    }),
};
const updateTeam = {
    params: joi_1.default.object().keys({
        teamId: joi_1.default.required().custom(custom_validation_1.objectId),
    }),
    body: joi_1.default.object()
        .keys({
        name: joi_1.default.string(),
        phone: joi_1.default.string(),
        school: joi_1.default.string(),
        email: joi_1.default.string(),
        schoolType: joi_1.default.string(),
        pass: joi_1.default.boolean(),
    })
        .min(1),
};
const deleteTeam = {
    params: joi_1.default.object().keys({
        teamId: joi_1.default.string().custom(custom_validation_1.objectId),
    }),
};
const teamValidation = {
    register,
    getTeamByName,
    getTeamById,
    getTeams,
    updateTeam,
    deleteTeam,
};
exports.default = teamValidation;
//# sourceMappingURL=team.validation.js.map