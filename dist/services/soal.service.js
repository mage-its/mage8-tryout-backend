"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSoalById = exports.userFinished = exports.userGetSoal = exports.userAnswer = exports.updateSoalById = exports.getSoalById = exports.querySoals = exports.createSoal = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const chance_1 = require("chance");
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const redis_1 = require("../config/redis");
const soal_interface_1 = require("../interfaces/soal.interface");
const models_1 = require("../models");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const createSoal = async (soalBody) => {
    const soal = await models_1.Soal.create(soalBody);
    const keys = await redis_1.redis?.keys('SOAL*');
    keys && redis_1.redis?.del(keys);
    return soal;
};
exports.createSoal = createSoal;
const querySoals = async (filter, options) => {
    const soals = await models_1.Soal.paginate(filter, options);
    return soals;
};
exports.querySoals = querySoals;
const getSoalById = async (id) => {
    return models_1.Soal.findById(id);
};
exports.getSoalById = getSoalById;
const updateSoalById = async (soalId, updateBody) => {
    const soal = await (0, exports.getSoalById)(soalId);
    if (!soal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Soal not found');
    }
    Object.assign(soal, updateBody);
    await soal.save();
    const keys = await redis_1.redis?.keys('SOAL*');
    keys && redis_1.redis?.del(keys);
    return soal;
};
exports.updateSoalById = updateSoalById;
const userAnswer = async (user, ip, soalId, answerInput) => {
    if (user.finished) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'User has finished the exam');
    }
    const soal = await (0, exports.getSoalById)(soalId);
    if (!soal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Soal not found');
    }
    if (soal.round > 1) {
        const populatedUser = (await user.populate('team'));
        if (!populatedUser?.team?.pass) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'User cannot access round 2');
        }
    }
    const cachedTime = await redis_1.redis?.get(`TIME-${soal.round}`);
    const time = cachedTime
        ? JSON.parse(cachedTime)
        : await models_1.Time.findOne({ round: soal.round });
    if (!time) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Time not found');
    }
    if (!cachedTime) {
        await redis_1.redis?.set(`TIME-${time.round}`, JSON.stringify(time), 'EX', 60 * 60);
    }
    const curTime = (0, moment_1.default)().valueOf();
    if (!(time.start < curTime && time.end > curTime)) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, `Exam has ${curTime < time.start ? 'not started' : 'ended'}`);
    }
    const { round } = soal;
    if (soal?.type !== 'ESAI_PANJANG') {
        if (user.answers?.some(({ id }) => id.toString() === soal?.id.toString())) {
            const userAns = user.answers.find((answer) => answer.id.toString() === soal?._id.toString())?.answer;
            if (answerInput === userAns) {
                const { _id, ...returnedUser } = {
                    ...user.toObject(),
                };
                delete returnedUser.score_1;
                delete returnedUser.score_2;
                delete returnedUser.password;
                returnedUser.id = _id;
                returnedUser.answers = returnedUser.answers?.map((answer) => {
                    const newAnswer = { ...answer };
                    delete newAnswer.verdict;
                    return newAnswer;
                });
                return returnedUser;
            }
            user.answers = user.answers.filter(({ id }) => id.toString() !== soal?.id.toString());
            if (userAns?.replaceAll(' ', '').trim().toUpperCase() ===
                soal?.answer.replaceAll(' ', '').trim().toUpperCase()) {
                if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === "SULIT") {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 -= 5;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === "SEDANG") {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 -= 3;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === "MUDAH") {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 -= 3;
                    }
                }
                else {
                    switch (soal?.difficulty) {
                        case 'MUDAH': {
                            if (round === 1) {
                                user.score_1 -= 1;
                            }
                            else {
                                user.score_2 -= 1;
                            }
                            break;
                        }
                        case 'SEDANG': {
                            if (round === 1) {
                                user.score_1 -= 2;
                            }
                            else {
                                user.score_2 -= 2;
                            }
                            break;
                        }
                        case 'SULIT': {
                            if (round === 1) {
                                user.score_1 -= 3;
                            }
                            else {
                                user.score_2 -= 3;
                            }
                            break;
                        }
                        case 'HOTS': {
                            if (round === 1) {
                                user.score_1 -= 4;
                            }
                            else {
                                user.score_2 -= 4;
                            }
                            break;
                        }
                    }
                }
            }
            else {
                if (round === 1) {
                    user.score_1 += 0;
                }
                else {
                    user.score_2 += 0;
                }
            }
            if (userAns?.replaceAll(' ', '').trim().toUpperCase() !==
                soal?.answer.replaceAll(' ', '').trim().toUpperCase()) {
                if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === "SULIT") {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 += 2;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === "SEDANG") {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 -= 3;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === "MUDAH") {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 += 1;
                    }
                }
                else {
                    switch (soal?.difficulty) {
                        case 'MUDAH': {
                            if (round === 1) {
                                user.score_1 -= 1;
                            }
                            else {
                                user.score_2 -= 1;
                            }
                            break;
                        }
                        case 'SEDANG': {
                            if (round === 1) {
                                user.score_1 -= 2;
                            }
                            else {
                                user.score_2 -= 2;
                            }
                            break;
                        }
                        case 'SULIT': {
                            if (round === 1) {
                                user.score_1 -= 3;
                            }
                            else {
                                user.score_2 -= 3;
                            }
                            break;
                        }
                        case 'HOTS': {
                            if (round === 1) {
                                user.score_1 -= 4;
                            }
                            else {
                                user.score_2 -= 4;
                            }
                            break;
                        }
                    }
                }
            }
            else {
                if (round === 1) {
                    user.score_1 += 0;
                }
                else {
                    user.score_2 += 0;
                }
            }
        }
        if (answerInput) {
            let verdict;
            if (answerInput.replaceAll(' ', '').trim().toUpperCase() ===
                soal?.answer.replaceAll(' ', '').trim().toUpperCase()) {
                if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === 'MUDAH') {
                    if (round === 1) {
                        user.score_1 += 3;
                    }
                    else {
                        user.score_2 += 3;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === 'SEDANG') {
                    if (round === 1) {
                        user.score_1 += 2;
                    }
                    else {
                        user.score_2 += 2;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === 'SULIT') {
                    if (round === 1) {
                        user.score_1 += 5;
                    }
                    else {
                        user.score_2 += 5;
                    }
                }
                else {
                    switch (soal.difficulty) {
                        case 'MUDAH': {
                            if (round === 1) {
                                user.score_1 += 1;
                            }
                            else {
                                user.score_2 += 1;
                            }
                            break;
                        }
                        case 'SEDANG': {
                            if (round === 1) {
                                user.score_1 += 2;
                            }
                            else {
                                user.score_2 += 2;
                            }
                            break;
                        }
                        case 'SULIT': {
                            if (round === 1) {
                                user.score_1 += 3;
                            }
                            else {
                                user.score_2 += 3;
                            }
                            break;
                        }
                        case 'HOTS': {
                            if (round === 1) {
                                user.score_1 += 4;
                            }
                            else {
                                user.score_2 += 4;
                            }
                            break;
                        }
                    }
                }
                verdict = 'CORRECT';
            }
            else {
                if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === 'MUDAH') {
                    if (round === 1) {
                        user.score_1 -= 3;
                    }
                    else {
                        user.score_2 -= 1;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === 'SEDANG') {
                    if (round === 1) {
                        user.score_1 -= 2;
                    }
                    else {
                        user.score_2 -= 2;
                    }
                }
                else if (soal.type === soal_interface_1.TipeSoal.ESAI_SINGKAT && soal.difficulty === 'SULIT') {
                    if (round === 1) {
                        user.score_1 -= 2;
                    }
                    else {
                        user.score_2 -= 2;
                    }
                }
                else {
                    if (round === 1) {
                        user.score_1 -= 0;
                    }
                    else {
                        user.score_2 -= 0;
                    }
                }
                verdict = 'INCORRECT';
            }
            if (!user.answers) {
                user.answers = [
                    {
                        id: soal?.id,
                        answer: answerInput,
                        round: soal.round,
                        verdict,
                    },
                ];
            }
            else {
                user.answers?.push({
                    id: soal?.id,
                    answer: answerInput,
                    round: soal.round,
                    verdict,
                });
            }
        }
    }
    else if (answerInput) {
        // ESAI_PANJANG
        if (user.answers) {
            user.answers = user.answers.filter(({ id }) => id.toString() !== soal?.id.toString());
            user.answers?.push({
                id: soal?.id,
                answer: answerInput,
                round: soal.round,
            });
        }
        else {
            user.answers = [
                {
                    id: soal?.id,
                    answer: answerInput,
                    round: soal.round,
                },
            ];
        }
    }
    else {
        // ESAI_PANJANG NO INPUT
        if (user.answers) {
            user.answers = user.answers.filter(({ id }) => id.toString() !== soal?.id.toString());
        }
    }
    await user.save();
    const { _id, ...returnedUser } = {
        ...user.toObject(),
    };
    delete returnedUser.score_1;
    delete returnedUser.score_2;
    delete returnedUser.password;
    returnedUser.id = _id;
    returnedUser.answers = returnedUser.answers?.map((answer) => {
        const newAnswer = { ...answer };
        delete newAnswer.verdict;
        return newAnswer;
    });
    return returnedUser;
};
exports.userAnswer = userAnswer;
const userGetSoal = async (user) => {
    if (user.role !== 'user' ||
        (user.school.toLowerCase() !== 'sma' && user.school.toLowerCase() !== 'smk')) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Peserta is not valid');
    }
    if (user.finished) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'User has finished the exam');
    }
    const curTime = (0, moment_1.default)().valueOf();
    const time = await models_1.Time.findOne({
        start: mongoose_1.default.trusted({ $lte: curTime }),
        end: mongoose_1.default.trusted({ $gte: curTime }),
    });
    if (!time) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'No exam at the moment');
    }
    if (time.round > 1) {
        const populatedUser = (await user.populate('team'));
        if (!populatedUser?.team?.pass) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'User cannot access round 2');
        }
    }
    const aggregateQuery = [
        {
            $match: {
                school: user.school,
                round: time.round,
            },
        },
        {
            $unset: 'answer',
        },
    ];
    const cachedSoal = await redis_1.redis?.get(`SOAL-${user.school}-${time.round}`);
    let soals;
    if (cachedSoal) {
        soals = JSON.parse(cachedSoal);
    }
    else {
        soals = await models_1.Soal.aggregate(aggregateQuery);
        redis_1.redis?.set(`SOAL-${user.school}-${time.round}`, JSON.stringify(soals), 'EX', 60 * 60);
    }
    const chance = new chance_1.Chance(user.id);
    const returnSoals = chance.shuffle(soals.map((soal) => ({
        ...soal,
        answered: user.answers?.some((answer) => answer.id.toString() === soal._id?.toString()) ?? false,
    })));
    return returnSoals;
};
exports.userGetSoal = userGetSoal;
const userFinished = async (user) => {
    if (!user) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Forbidden');
    }
    if (user.role !== 'user' ||
        (user.school.toLowerCase() !== 'sma' && user.school.toLowerCase() !== 'smk')) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Peserta is not valid');
    }
    user.finished = true;
    return user.save();
};
exports.userFinished = userFinished;
const deleteSoalById = async (soalId) => {
    const soal = await (0, exports.getSoalById)(soalId);
    if (!soal) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Soal not found');
    }
    await soal.remove();
    const keys = await redis_1.redis?.keys('SOAL*');
    keys && redis_1.redis?.del(keys);
    return soal;
};
exports.deleteSoalById = deleteSoalById;
const soalService = {
    createSoal: exports.createSoal,
    querySoals: exports.querySoals,
    getSoalById: exports.getSoalById,
    updateSoalById: exports.updateSoalById,
    deleteSoalById: exports.deleteSoalById,
};
exports.default = soalService;
//# sourceMappingURL=soal.service.js.map