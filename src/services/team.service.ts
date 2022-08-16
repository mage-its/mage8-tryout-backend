import { FilterQuery } from 'mongoose';

import TeamInterface from '../interfaces/team.interface';
import UserInterface from '../interfaces/user.interface';
import { User } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import Team from '../models/team.model';

const createTeam = async (
  teamBody: TeamInterface,
  userBodies: UserInterface[]
) => {
  const team = await Team.create(teamBody);
  const users = await User.insertMany(
    userBodies.map((userBody) => ({ ...userBody, team: team.id }))
  );
  Object.assign(team, { membersId: users.map((user) => user.id) });
  team.save();
  return [team, users];
};

const getTeamByName = async (name: string) => {
  const aggregateQuery = [
    {
      $match: {
        name,
        'membersId.0': { $exists: true },
      },
    },
    {
      $lookup: {
        from: User.collection.collectionName,
        localField: '_id',
        foreignField: 'team',
        as: 'members',
      },
    },
    {
      $unset: 'members.password',
    },
  ];

  const team = await Team.aggregate<
    TeamInterface & { members: UserInterface[] }
  >(aggregateQuery);

  return team;
};

const queryTeams = async (
  filter: FilterQuery<unknown>,
  options: QueryOption
) => {
  const teams = await Team.paginate(filter, options);
  return teams;
};

const teamService = {
  createTeam,
  getTeamByName,
  queryTeams,
};

export default teamService;
