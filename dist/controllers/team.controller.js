"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const team_service_1 = __importDefault(require("../services/team.service"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const pick_1 = __importDefault(require("../utils/pick"));
const register = (0, catchAsync_1.default)(async (req, res) => {
    const u = [req.body.user1, req.body.user2, req.body.user3];
    const t = req.body.team;
    const [team, users] = await team_service_1.default.createTeam(t, u);
    res.status(http_status_1.default.CREATED).send({ team, users });
});
const getTeamByName = (0, catchAsync_1.default)(async (req, res) => {
    const team = await team_service_1.default.getTeamByName(req.query.name);
    res.send({ team });
});
const getTeamById = (0, catchAsync_1.default)(async (req, res) => {
    const team = await team_service_1.default.getTeamById(req.params.teamId);
    res.send({ team });
});
const getTeams = (0, catchAsync_1.default)(async (req, res) => {
    const filter = (0, pick_1.default)(req.query, ['name', 'school', 'schoolType']);
    const options = (0, pick_1.default)(req.query, ['sortBy', 'limit', 'page']);
    const result = await team_service_1.default.queryTeams(filter, options);
    res.send(result);
});
const updateTeam = (0, catchAsync_1.default)(async (req, res) => {
    const team = await team_service_1.default.updateTeamById(req.params.teamId, req.body);
    res.send(team);
});
const deleteTeam = (0, catchAsync_1.default)(async (req, res) => {
    await team_service_1.default.deleteTeamById(req.params.teamId);
    res.status(http_status_1.default.NO_CONTENT).send();
});
const teamController = {
    register,
    getTeamByName,
    getTeamById,
    getTeams,
    updateTeam,
    deleteTeam,
};
exports.default = teamController;
//# sourceMappingURL=team.controller.js.map