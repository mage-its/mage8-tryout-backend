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
const createTime = (0, catchAsync_1.default)(async (req, res) => {
    const time = await services_1.timeService.createTime(req.body);
    res.status(http_status_1.default.CREATED).send(time);
});
const getTimes = (0, catchAsync_1.default)(async (req, res) => {
    const filter = (0, pick_1.default)(req.query, ['round']);
    const options = (0, pick_1.default)(req.query, ['sortBy', 'limit', 'page']);
    const result = await services_1.timeService.queryTimes(filter, options);
    res.send(result);
});
const getTime = (0, catchAsync_1.default)(async (req, res) => {
    const time = await services_1.timeService.getTimeById(req.params.timeId);
    if (!time) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Time not found');
    }
    res.send(time);
});
const updateTime = (0, catchAsync_1.default)(async (req, res) => {
    const time = await services_1.timeService.updateTimeById(req.params.timeId, req.body);
    res.send(time);
});
const deleteTime = (0, catchAsync_1.default)(async (req, res) => {
    await services_1.timeService.deleteTimeById(req.params.timeId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const timeController = {
    createTime,
    getTimes,
    getTime,
    updateTime,
    deleteTime,
};
exports.default = timeController;
//# sourceMappingURL=time.controller.js.map