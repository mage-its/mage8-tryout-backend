"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = exports.tokenService = exports.timeService = exports.teamService = exports.soalService = exports.emailService = exports.authService = void 0;
exports.authService = __importStar(require("./auth.service"));
exports.emailService = __importStar(require("./email.service"));
exports.soalService = __importStar(require("./soal.service"));
exports.teamService = __importStar(require("./team.service"));
exports.timeService = __importStar(require("./time.service"));
exports.tokenService = __importStar(require("./token.service"));
exports.userService = __importStar(require("./user.service"));
//# sourceMappingURL=index.js.map