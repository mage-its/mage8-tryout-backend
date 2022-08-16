import TeamInterface from '../interfaces/team.interface';
import UserInterface from '../interfaces/user.interface';
import { User } from '../models';
import Team from '../models/team.model';

const createTeam = async (
  teamBody: TeamInterface,
  userBodies: UserInterface[]
) => {
  const team = await Team.create(teamBody);
  const users = await User.insertMany(
    userBodies.map((userBody) => ({ ...userBody, team: team.id }))
  );
  Object.assign(team, { members: users.map((user) => user.id) });
  team.save();
  return [team, users];
};

const teamService = {
  createTeam,
};

export default teamService;
