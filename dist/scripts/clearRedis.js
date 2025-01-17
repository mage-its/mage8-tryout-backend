"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default();
(async () => {
    if (!redis)
        return;
    const keys = await redis?.keys('*');
    await redis.del(keys);
    redis.disconnect();
})();
//# sourceMappingURL=clearRedis.js.map