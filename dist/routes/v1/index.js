"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("../../config/config"));
const auth_route_1 = __importDefault(require("./auth.route"));
const docs_route_1 = __importDefault(require("./docs.route"));
const soal_route_1 = __importDefault(require("./soal.route"));
const team_route_1 = __importDefault(require("./team.route"));
const time_route_1 = __importDefault(require("./time.route"));
const user_route_1 = __importDefault(require("./user.route"));
const router = express_1.default.Router();
const defaultRoutes = [
    {
        path: '/auth',
        route: auth_route_1.default,
    },
    {
        path: '/users',
        route: user_route_1.default,
    },
    {
        path: '/team',
        route: team_route_1.default,
    },
    {
        path: '/soal',
        route: soal_route_1.default,
    },
    {
        path: '/time',
        route: time_route_1.default,
    },
];
const devRoutes = [
    // routes available only in development mode
    {
        path: '/docs',
        route: docs_route_1.default,
    },
];
router.get('/ping', (req, res) => res.send('PONG'));
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
/* istanbul ignore next */
if (config_1.default.env === 'development') {
    devRoutes.forEach((route) => {
        router.use(route.path, route.route);
    });
}
exports.default = router;
//# sourceMappingURL=index.js.map