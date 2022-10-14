"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("../config/config"));
const swaggerDef = {
    openapi: '3.0.0',
    info: {
        title: 'node-express-boilerplate API documentation',
        version: process.env.npm_package_version,
        license: {
            name: 'MIT',
            url: 'https://github.com/hagopj13/node-express-boilerplate/blob/master/LICENSE',
        },
    },
    servers: [
        {
            url: `http://localhost:${config_1.default.port}/v1`,
        },
    ],
};
exports.default = swaggerDef;
//# sourceMappingURL=swaggerDef.js.map