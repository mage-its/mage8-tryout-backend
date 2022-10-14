"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const services_1 = require("../services");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const pick_1 = __importDefault(require("../utils/pick"));
const createSoal = (0, catchAsync_1.default)(async (req, res) => {
    const soal = await services_1.soalService.createSoal(req.body);
    res.status(http_status_1.default.CREATED).send(soal);
});
const userAnswer = (0, catchAsync_1.default)(async (req, res) => {
    const soal = await services_1.soalService.userAnswer(req.user, req.ip, req.body.soalId, req.body.answer?.trim());
    res.status(http_status_1.default.CREATED).send(soal);
});
const userFinished = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.soalService.userFinished(req.user);
    res.status(http_status_1.default.CREATED).send({ message: 'OK' });
});
const getSoals = (0, catchAsync_1.default)(async (req, res) => {
    const filter = (0, pick_1.default)(req.query, ['type', 'school', 'difficulty', 'round']);
    const options = (0, pick_1.default)(req.query, ['sortBy', 'limit', 'page']);
    const result = await services_1.soalService.querySoals(filter, options);
    res.send(result);
});
const getSoal = (0, catchAsync_1.default)(async (req, res) => {
    const soal = await services_1.soalService.getSoalById(req.params.soalId);
    if (!soal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Soal not found');
    }
    res.send(soal);
});
const getSoalsPeserta = (0, catchAsync_1.default)(async (req, res) => {
    const soals = await services_1.soalService.userGetSoal(req.user);
    res.send(soals);
});
const updateSoal = (0, catchAsync_1.default)(async (req, res) => {
    const soal = await services_1.soalService.updateSoalById(req.params.soalId, req.body);
    res.send(soal);
});
const deleteSoal = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.soalService.deleteSoalById(req.params.soalId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const soalController = {
    createSoal,
    userAnswer,
    userFinished,
    getSoals,
    getSoal,
    getSoalsPeserta,
    updateSoal,
    deleteSoal,
};
exports.default = soalController;
//# sourceMappingURL=soal.controller.js.map