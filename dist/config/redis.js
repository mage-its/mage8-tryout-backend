"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = __importDefault(require("./logger"));
exports.redis = new ioredis_1.default();
exports.redis.on('error', (err) => {
    logger_1.default.error(err.message);
    if (err.code === 'ECONNREFUSED') {
        exports.redis?.disconnect();
        logger_1.default.error('Redis connection refused, exiting...');
        exports.redis = null;
    }
});
exports.redis.on('connect', () => {
    logger_1.default.info('Connected to Redis');
});
//# sourceMappingURL=redis.js.map