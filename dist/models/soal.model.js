"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Soal = void 0;
const mongoose_1 = require("mongoose");
const soal_interface_1 = require("../interfaces/soal.interface");
const plugins_1 = require("./plugins");
const soalSchema = new mongoose_1.Schema({
    question: {
        type: String,
        required: true,
    },
    multipleChoice: {
        type: [String],
    },
    difficulty: {
        type: String,
        required: true,
        enum: [
            soal_interface_1.Difficulty.MUDAH,
            soal_interface_1.Difficulty.SEDANG,
            soal_interface_1.Difficulty.SULIT,
            soal_interface_1.Difficulty.HOTS,
        ],
    },
    school: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    round: {
        type: Number,
        required: true,
        default: 1,
    },
    type: {
        type: String,
        enum: [soal_interface_1.TipeSoal.PILGAN, soal_interface_1.TipeSoal.ESAI_SINGKAT, soal_interface_1.TipeSoal.ESAI_PANJANG],
        required: true,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
soalSchema.plugin(plugins_1.toJSON);
soalSchema.plugin(plugins_1.paginate);
exports.Soal = (0, mongoose_1.model)('Soal', soalSchema);
exports.default = exports.Soal;
//# sourceMappingURL=soal.model.js.map