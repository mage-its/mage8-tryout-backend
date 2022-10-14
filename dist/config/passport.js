"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const user_model_1 = __importDefault(require("../models/user.model"));
const config_1 = __importDefault(require("./config"));
const tokens_1 = require("./tokens");
const jwtOptions = {
    secretOrKey: config_1.default.jwt.secret,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
};
const jwtVerify = async (payload, done) => {
    try {
        if (payload.type !== tokens_1.tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const user = await user_model_1.default.findById(payload.sub);
        if (!user) {
            return done(null, false);
        }
        done(null, user);
    }
    catch (error) {
        done(error, false);
    }
};
exports.jwtStrategy = new passport_jwt_1.Strategy(jwtOptions, jwtVerify);
//# sourceMappingURL=passport.js.map