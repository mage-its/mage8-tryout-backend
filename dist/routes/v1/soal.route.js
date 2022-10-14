"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const soal_controller_1 = __importDefault(require("../../controllers/soal.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const ensureOneIp_1 = __importDefault(require("../../middlewares/ensureOneIp"));
const validate_1 = __importDefault(require("../../middlewares/validate"));
const soal_validation_1 = __importDefault(require("../../validations/soal.validation"));
const router = express_1.default.Router();
router
    .route('/')
    .post((0, auth_1.default)('manageSoals'), (0, validate_1.default)(soal_validation_1.default.createSoal), soal_controller_1.default.createSoal)
    .get((0, auth_1.default)('getSoals'), (0, validate_1.default)(soal_validation_1.default.getSoals), soal_controller_1.default.getSoals);
router
    .route('/peserta')
    .get((0, auth_1.default)(), soal_controller_1.default.getSoalsPeserta)
    .post((0, auth_1.default)(), (0, validate_1.default)(soal_validation_1.default.userAnswer), ensureOneIp_1.default, soal_controller_1.default.userAnswer);
router.post('/peserta/finish', (0, auth_1.default)(), ensureOneIp_1.default, soal_controller_1.default.userFinished);
router
    .route('/:soalId')
    .get((0, auth_1.default)('getSoals'), (0, validate_1.default)(soal_validation_1.default.getSoal), soal_controller_1.default.getSoal)
    .patch((0, auth_1.default)('manageSoals'), (0, validate_1.default)(soal_validation_1.default.updateSoal), soal_controller_1.default.updateSoal)
    .delete((0, auth_1.default)('manageSoals'), (0, validate_1.default)(soal_validation_1.default.deleteSoal), soal_controller_1.default.deleteSoal);
exports.default = router;
//# sourceMappingURL=soal.route.js.map