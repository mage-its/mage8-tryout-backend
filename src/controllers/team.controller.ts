import httpStatus from 'http-status';

import { QueryOption } from '../models/plugins/paginate.plugin';
import teamService from '../services/team.service';
import catchAsync from '../utils/catchAsync';
import pick from '../utils/pick';

const register = catchAsync(async (req, res) => {
  const u = [req.body.user1, req.body.user2, req.body.user3];
  const t = req.body.team;
  const [team, users] = await teamService.createTeam(t, u);
  res.status(httpStatus.CREATED).send({ team, users });
});

const getTeamByName = catchAsync(async (req, res) => {
  const team = await teamService.getTeamByName(req.query.name as string);
  res.send({ team });
});

const getTeamById = catchAsync(async (req, res) => {
  const team = await teamService.getTeamById(req.params.teamId as string);
  res.send({ team });
});

const getTeams = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'school']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']) as QueryOption;
  const result = await teamService.queryTeams(filter, options);
  res.send(result);
});

const updateTeam = catchAsync(async (req, res) => {
  const team = await teamService.updateTeamById(req.params.teamId, req.body);
  res.send(team);
});

const deleteTeam = catchAsync(async (req, res) => {
  await teamService.deleteTeamById(req.params.teamId);
  res.status(httpStatus.NO_CONTENT).send();
});

const teamController = {
  register,
  getTeamByName,
  getTeamById,
  getTeams,
  updateTeam,
  deleteTeam,
};

export default teamController;
