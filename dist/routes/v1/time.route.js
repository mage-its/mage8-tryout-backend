"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const time_controller_1 = __importDefault(require("../../controllers/time.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = __importDefault(require("../../middlewares/validate"));
const time_validation_1 = __importDefault(require("../../validations/time.validation"));
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)('manageTime'), (0, validate_1.default)(time_validation_1.default.createTime), time_controller_1.default.createTime)
    .get((0, validate_1.default)(time_validation_1.default.getTimes), time_controller_1.default.getTimes);
router
    .route('/:timeId')
    .get((0, validate_1.default)(time_validation_1.default.getTime), time_controller_1.default.getTime)
    .patch((0, auth_1.default)('manageTime'), (0, validate_1.default)(time_validation_1.default.updateTime), time_controller_1.default.updateTime)
    .delete((0, auth_1.default)('manageTime'), (0, validate_1.default)(time_validation_1.default.deleteTime), time_controller_1.default.deleteTime);
exports.default = router;
//# sourceMappingURL=time.route.js.map