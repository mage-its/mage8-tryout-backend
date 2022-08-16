import httpStatus from 'http-status';
import mongoose, { FilterQuery } from 'mongoose';

import TeamInterface from '../interfaces/team.interface';
import { Team } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

const createTeam = async (
  teamBody: TeamInterface,
  teamBodies: TeamInterface[]
) => {
  const team = await Team.create(teamBody);
  const teams = await Team.insertMany(
    teamBodies.map((teamBody) => ({ ...teamBody, team: team.id }))
  );
  Object.assign(team, { membersId: teams.map((team) => team.id) });
  team.save();
  return [team, teams];
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
        from: Team.collection.collectionName,
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
    TeamInterface & { members: TeamInterface[] }
  >(aggregateQuery);

  return team;
};

const getTeamById = async (id: string) => {
  const _id = new mongoose.Types.ObjectId(id);
  const aggregateQuery = [
    {
      $match: {
        _id,
      },
    },
    {
      $lookup: {
        from: Team.collection.collectionName,
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
    TeamInterface & { members: TeamInterface[] }
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

const updateTeamById = async (
  teamId: string,
  updateBody: Partial<TeamInterface>
) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  if (
    updateBody.name &&
    (await Team.isTeamnameTaken(updateBody.name, teamId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team name already taken');
  }
  Object.assign(team, updateBody);
  await team.save();
  return team;
};

const deleteTeamById = async (teamId: string) => {
  const team = await Team.findById(teamId);
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  await team.remove();
  return team;
};

const teamService = {
  createTeam,
  getTeamByName,
  getTeamById,
  queryTeams,
  updateTeamById,
  deleteTeamById,
};

export default teamService;
