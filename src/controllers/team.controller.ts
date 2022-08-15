import httpStatus from 'http-status';

import teamService from '../services/team.service';
import catchAsync from '../utils/catchAsync';

const register = catchAsync(async (req, res) => {
  const u = [req.body.user1, req.body.user2, req.body.user3];
  const t = req.body.team;
  const [team, users] = await teamService.createTeam(t, u);
  res.status(httpStatus.CREATED).send({ team, users });
});

const teamController = {
  register,
};

export default teamController;
