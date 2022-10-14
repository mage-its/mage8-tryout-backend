"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Token = void 0;
const mongoose_1 = require("mongoose");
const tokens_1 = require("../config/tokens");
const plugins_1 = require("./plugins");
const tokenSchema = new mongoose_1.Schema({
    token: {
        type: String,
        required: true,
        index: true,
    },
    user: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: [
            tokens_1.tokenTypes.REFRESH,
            tokens_1.tokenTypes.RESET_PASSWORD,
            tokens_1.tokenTypes.VERIFY_EMAIL,
        ],
        required: true,
    },
    expires: {
        type: Date,
        required: true,
    },
    blacklisted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
tokenSchema.plugin(plugins_1.toJSON);
exports.Token = (0, mongoose_1.model)('Token', tokenSchema);
exports.default = exports.Token;
//# sourceMappingURL=token.model.js.map