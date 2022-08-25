import httpStatus from 'http-status';
import mongoose, { FilterQuery } from 'mongoose';

import TeamInterface from '../interfaces/team.interface';
import UserInterface from '../interfaces/user.interface';
import { Team, User } from '../models';
import { QueryOption } from '../models/plugins/paginate.plugin';
import ApiError from '../utils/ApiError';

export const createTeam = async (
  teamBody: TeamInterface,
  userBodies: UserInterface[]
) => {
  const { schoolType } = teamBody;
  const team = await Team.create(teamBody);
  const teams = await User.insertMany(
    userBodies.map((teamBody) => ({
      ...teamBody,
      team: team.id,
      school: teamBody.school ?? schoolType,
    }))
  );
  Object.assign(team, { membersId: teams.map((team) => team.id) });
  team.save();
  return [team, teams];
};

export const getTeamByName = async (name: string) => {
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

export const getTeamById = async (id: string) => {
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

export const queryTeams = async (
  filter: FilterQuery<unknown>,
  options: QueryOption
) => {
  const teams = await Team.paginate(filter, options);
  return teams;
};

export const updateTeamById = async (
  teamId: string,
  updateBody: Partial<TeamInterface>
) => {
  const team = await Team.findById(teamId);
  const { schoolType } = updateBody;
  if (!team) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Team not found');
  }
  if (
    updateBody.name &&
    (await Team.isTeamnameTaken(updateBody.name, teamId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Team name already taken');
  }
  if (schoolType) {
    team.membersId.forEach((memberId) => {
      User.findByIdAndUpdate(memberId, { school: schoolType }).exec();
    });
  }
  Object.assign(team, updateBody);
  await team.save();
  return team;
};

export const deleteTeamById = async (teamId: string) => {
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
