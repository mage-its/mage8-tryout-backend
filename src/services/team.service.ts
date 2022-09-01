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
        from: User.collection.collectionName,
        localField: '_id',
        foreignField: 'team',
        as: 'members',
      },
    },
    {
      $unset: 'members.password',
    },
    {
      $project: {
        scoreTotal_1: {
          $sum: '$members.score_1',
        },
        scoreTotal_2: {
          $sum: '$members.score_2',
        },
        scoreTotal: {
          $sum: ['$scoreTotal_1', '$scoreTotal_2'],
        },
        membersId: 1,
        name: 1,
        phone: 1,
        school: 1,
        schoolType: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        corrected: {
          $size: {
            $filter: {
              input: '$members',
              cond: { $eq: ['$$this.corrected', true] },
            },
          },
        },
      },
    },
    {
      $project: {
        scoreTotal_1: 1,
        scoreTotal_2: 1,
        scoreTotal: {
          $sum: ['$scoreTotal_1', '$scoreTotal_2'],
        },
        membersId: 1,
        name: 1,
        phone: 1,
        school: 1,
        schoolType: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        corrected: 1,
      },
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
        from: User.collection.collectionName,
        localField: '_id',
        foreignField: 'team',
        as: 'members',
      },
    },
    {
      $unset: 'members.password',
    },
    {
      $project: {
        scoreTotal_1: {
          $sum: '$members.score_1',
        },
        scoreTotal_2: {
          $sum: '$members.score_2',
        },
        scoreTotal: {
          $sum: ['$scoreTotal_1', '$scoreTotal_2'],
        },
        membersId: 1,
        name: 1,
        phone: 1,
        school: 1,
        schoolType: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        corrected: {
          $size: {
            $filter: {
              input: '$members',
              cond: { $eq: ['$$this.corrected', true] },
            },
          },
        },
      },
    },
    {
      $project: {
        scoreTotal_1: 1,
        scoreTotal_2: 1,
        scoreTotal: {
          $sum: ['$scoreTotal_1', '$scoreTotal_2'],
        },
        membersId: 1,
        name: 1,
        phone: 1,
        school: 1,
        schoolType: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        corrected: 1,
      },
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
  const sortOpts: { [key: string]: 1 | -1 } = {};
  options.sortBy?.split(',').forEach((sortOption) => {
    const [key, order] = sortOption.split(':');
    if (!key) return;
    sortOpts[key] = order?.toLowerCase() === 'desc' ? -1 : 1;
  });
  const aggregateQuery = [
    {
      $match: filter,
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
    {
      $project: {
        scoreTotal_1: {
          $sum: '$members.score_1',
        },
        scoreTotal_2: {
          $sum: '$members.score_2',
        },
        scoreTotal: {
          $sum: ['$scoreTotal_1', '$scoreTotal_2'],
        },
        membersId: 1,
        name: 1,
        phone: 1,
        school: 1,
        schoolType: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        corrected: {
          $size: {
            $filter: {
              input: '$members',
              cond: { $eq: ['$$this.corrected', true] },
            },
          },
        },
      },
    },
    {
      $project: {
        scoreTotal_1: 1,
        scoreTotal_2: 1,
        scoreTotal: {
          $sum: ['$scoreTotal_1', '$scoreTotal_2'],
        },
        membersId: 1,
        name: 1,
        phone: 1,
        school: 1,
        schoolType: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,
        members: 1,
        corrected: 1,
      },
    },
    {
      $sort:
        Object.keys(sortOpts).length === 0
          ? ({ createdAt: 1 } as { [key: string]: 1 | -1 })
          : sortOpts,
    },
  ];
  options.limit = options.limit ?? 10;
  const aggr = Team.aggregate(aggregateQuery);
  const result = await Team.aggregatePaginate(aggr, {
    ...(options.page != null && { page: +options.page }),
    ...(options.limit != null && { limit: +options.limit }),
  });
  return result;
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
