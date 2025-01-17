"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const helmet_1 = __importDefault(require("helmet"));
const http_status_1 = __importDefault(require("http-status"));
const passport_1 = __importDefault(require("passport"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config/config"));
const morgan_1 = __importDefault(require("./config/morgan"));
const passport_2 = require("./config/passport");
const error_1 = require("./middlewares/error");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const v1_1 = __importDefault(require("./routes/v1"));
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const app = (0, express_1.default)();
app.set('trust proxy', true);
if (config_1.default.env !== 'test') {
    app.use(morgan_1.default.successHandler);
    app.use(morgan_1.default.errorHandler);
}
// set security HTTP headers
app.use((0, helmet_1.default)());
// parse json request body
app.use(express_1.default.json());
// parse urlencoded request body
app.use(express_1.default.urlencoded({ extended: true }));
// sanitize request data
app.use((0, express_mongo_sanitize_1.default)());
// gzip compression
app.use((0, compression_1.default)());
// enable cors
app.use((0, cors_1.default)({ credentials: true, origin: true }));
app.options('*', (0, cors_1.default)());
app.use('/static', express_1.default.static(path_1.default.join(__dirname, '../public')));
// jwt authentication
app.use(passport_1.default.initialize());
passport_1.default.use('jwt', passport_2.jwtStrategy);
// limit repeated failed requests to auth endpoints
if (config_1.default.env === 'production') {
    app.use('/v1/auth', rateLimiter_1.authLimiter);
}
// v1 api routes
app.use('/v1', v1_1.default);
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Not found'));
});
// convert error to ApiError, if needed
app.use(error_1.errorConverter);
// handle error
app.use(error_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map