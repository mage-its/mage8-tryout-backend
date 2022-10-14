"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const team_controller_1 = __importDefault(require("../../controllers/team.controller"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validate_1 = __importDefault(require("../../middlewares/validate"));
const team_validation_1 = __importDefault(require("../../validations/team.validation"));
const router = express_1.default.Router();
router.post('/register', (0, auth_1.default)('manageUsers'), (0, validate_1.default)(team_validation_1.default.register), team_controller_1.default.register);
router.get('/', (0, auth_1.default)('manageUsers'), (0, validate_1.default)(team_validation_1.default.getTeamByName), team_controller_1.default.getTeamByName);
router.get('/all', (0, auth_1.default)('manageUsers'), (0, validate_1.default)(team_validation_1.default.getTeams), team_controller_1.default.getTeams);
router
    .route('/:teamId')
    .get((0, auth_1.default)('getUsers'), (0, validate_1.default)(team_validation_1.default.getTeamById), team_controller_1.default.getTeamById)
    .patch((0, auth_1.default)('manageUsers'), (0, validate_1.default)(team_validation_1.default.updateTeam), team_controller_1.default.updateTeam)
    .delete((0, auth_1.default)('manageUsers'), (0, validate_1.default)(team_validation_1.default.deleteTeam), team_controller_1.default.deleteTeam);
exports.default = router;
//# sourceMappingURL=team.route.js.map