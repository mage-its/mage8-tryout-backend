"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
exports.authLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 20,
    skipSuccessfulRequests: true,
});
//# sourceMappingURL=rateLimiter.js.map