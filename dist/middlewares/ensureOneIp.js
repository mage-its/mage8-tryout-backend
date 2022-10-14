"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config/config"));
const redis_1 = require("../config/redis");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const ensureOneIp = (0, catchAsync_1.default)(async (req, res, next) => {
    if (config_1.default.ensureOneIp) {
        if (!req.user) {
            return next(new ApiError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized'));
        }
        const redisUser = await redis_1.redis?.get(req.user.id);
        if (redisUser && req.ip !== redisUser) {
            return next(new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Max login reached, please logout from another device'));
        }
        await redis_1.redis?.set(req.user.id, req.ip, 'EX', 60 * 60 * 3);
    }
    return next();
});
exports.default = ensureOneIp;
//# sourceMappingURL=ensureOneIp.js.map