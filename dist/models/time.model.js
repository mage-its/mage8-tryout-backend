"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
const mongoose_1 = require("mongoose");
const plugins_1 = require("./plugins");
const timeSchema = new mongoose_1.Schema({
    start: {
        type: Number,
        required: true,
    },
    end: {
        type: Number,
        required: true,
    },
    round: {
        type: Number,
        enum: [1, 2],
        required: true,
        unique: true,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
timeSchema.plugin(plugins_1.toJSON);
timeSchema.plugin(plugins_1.paginate);
exports.Time = (0, mongoose_1.model)('Time', timeSchema);
exports.default = exports.Time;
//# sourceMappingURL=time.model.js.map