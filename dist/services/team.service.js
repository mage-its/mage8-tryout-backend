"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTeamById = exports.updateTeamById = exports.queryTeams = exports.getTeamById = exports.getTeamByName = exports.createTeam = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createTeam = async (teamBody, userBodies) => {
    const { schoolType } = teamBody;
    const team = await models_1.Team.create(teamBody);
    const teams = await models_1.User.insertMany(userBodies.map((teamBody) => ({
        ...teamBody,
        team: team.id,
        school: teamBody.school ?? schoolType,
    })));
    Object.assign(team, { membersId: teams.map((team) => team.id) });
    team.save();
    return [team, teams];
};
exports.createTeam = createTeam;
const getTeamByName = async (name) => {
    const aggregateQuery = [
        {
            $match: {
                name,
                'membersId.0': { $exists: true },
            },
        },
        {
            $lookup: {
                from: models_1.User.collection.collectionName,
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
    const team = await models_1.Team.aggregate(aggregateQuery);
    return team;
};
exports.getTeamByName = getTeamByName;
const getTeamById = async (id) => {
    const _id = new mongoose_1.default.Types.ObjectId(id);
    const aggregateQuery = [
        {
            $match: {
                _id,
            },
        },
        {
            $lookup: {
                from: models_1.User.collection.collectionName,
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
                pass: 1,
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
                pass: 1,
                corrected: 1,
            },
        },
    ];
    const team = await models_1.Team.aggregate(aggregateQuery);
    return team;
};
exports.getTeamById = getTeamById;
const queryTeams = async (filter, options) => {
    const sortOpts = {};
    options.sortBy?.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        if (!key)
            return;
        sortOpts[key] = order?.toLowerCase() === 'desc' ? -1 : 1;
    });
    const aggregateQuery = [
        {
            $match: filter,
        },
        {
            $lookup: {
                from: models_1.User.collection.collectionName,
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
                pass: 1,
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
                pass: 1,
                corrected: 1,
            },
        },
        {
            $sort: Object.keys(sortOpts).length === 0
                ? { createdAt: 1 }
                : sortOpts,
        },
    ];
    options.limit = options.limit ?? 10;
    const aggr = models_1.Team.aggregate(aggregateQuery);
    const result = await models_1.Team.aggregatePaginate(aggr, {
        ...(options.page != null && { page: +options.page }),
        ...(options.limit != null && { limit: +options.limit }),
    });
    return result;
};
exports.queryTeams = queryTeams;
const updateTeamById = async (teamId, updateBody) => {
    const team = await models_1.Team.findById(teamId);
    const { schoolType } = updateBody;
    if (!team) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Team not found');
    }
    if (updateBody.name &&
        (await models_1.Team.isTeamnameTaken(updateBody.name, teamId))) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Team name already taken');
    }
    if (schoolType) {
        team.membersId.forEach((memberId) => {
            models_1.User.findByIdAndUpdate(memberId, { school: schoolType }).exec();
        });
    }
    Object.assign(team, updateBody);
    await team.save();
    return team;
};
exports.updateTeamById = updateTeamById;
const deleteTeamById = async (teamId) => {
    const team = await models_1.Team.findById(teamId);
    if (!team) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Team not found');
    }
    await team.remove();
    return team;
};
exports.deleteTeamById = deleteTeamById;
const teamService = {
    createTeam: exports.createTeam,
    getTeamByName: exports.getTeamByName,
    getTeamById: exports.getTeamById,
    queryTeams: exports.queryTeams,
    updateTeamById: exports.updateTeamById,
    deleteTeamById: exports.deleteTeamById,
};
exports.default = teamService;
//# sourceMappingURL=team.service.js.map