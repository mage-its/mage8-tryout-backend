"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTimeById = exports.updateTimeById = exports.getTimeById = exports.queryTimes = exports.createTime = void 0;
const http_status_1 = __importDefault(require("http-status"));
const redis_1 = require("../config/redis");
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createTime = async (timeBody) => {
    const keys = await redis_1.redis?.keys('TIME*');
    keys && redis_1.redis?.del(keys);
    return models_1.Time.create(timeBody);
};
exports.createTime = createTime;
const queryTimes = async (filter, options) => {
    const times = await models_1.Time.paginate(filter, options);
    return times;
};
exports.queryTimes = queryTimes;
const getTimeById = async (id) => {
    return models_1.Time.findById(id);
};
exports.getTimeById = getTimeById;
const updateTimeById = async (timeId, updateBody) => {
    const time = await (0, exports.getTimeById)(timeId);
    if (!time) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Time not found');
    }
    Object.assign(time, updateBody);
    await time.save();
    const keys = await redis_1.redis?.keys('TIME*');
    keys && redis_1.redis?.del(keys);
    return time;
};
exports.updateTimeById = updateTimeById;
const deleteTimeById = async (timeId) => {
    const time = await (0, exports.getTimeById)(timeId);
    if (!time) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Time not found');
    }
    await time.remove();
    const keys = await redis_1.redis?.keys('TIME*');
    keys && redis_1.redis?.del(keys);
    return time;
};
exports.deleteTimeById = deleteTimeById;
const timeService = {
    createTime: exports.createTime,
    queryTimes: exports.queryTimes,
    getTimeById: exports.getTimeById,
    updateTimeById: exports.updateTimeById,
    deleteTimeById: exports.deleteTimeById,
};
exports.default = timeService;
//# sourceMappingURL=time.service.js.map