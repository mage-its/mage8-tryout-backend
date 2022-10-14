"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importStar(require("mongoose"));
const roles_1 = require("../config/roles");
const plugins_1 = require("./plugins");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 8,
        // validate(value: string) {
        //   if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        //     throw new Error(
        //       'Password must contain at least one letter and one number'
        //     );
        //   }
        // },
        private: true, // used by the toJSON plugin
    },
    corrected: {
        type: Boolean,
        required: true,
        default: false,
    },
    team: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Team',
    },
    school: {
        type: String,
        enum: ['SMA', 'SMK'],
        required: true,
    },
    score_1: {
        type: Number,
        required: true,
        default: 0,
    },
    score_2: {
        type: Number,
        required: true,
        default: 0,
    },
    answers: {
        type: [mongoose_1.Schema.Types.Mixed],
    },
    finished: {
        type: Boolean,
        required: true,
        default: false,
    },
    role: {
        type: String,
        enum: roles_1.roles,
        default: 'user',
    },
}, {
    timestamps: true,
});
// add plugin that converts mongoose to json
userSchema.plugin(plugins_1.toJSON);
userSchema.plugin(plugins_1.paginate);
userSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
    const user = await this.findOne({
        username,
        _id: mongoose_1.default.trusted({ $ne: excludeUserId }),
    });
    return !!user;
};
userSchema.methods.isPasswordMatch = async function (password) {
    const user = this;
    return bcryptjs_1.default.compare(password, user.password);
};
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcryptjs_1.default.hash(user.password, 8);
    }
    next();
});
userSchema.pre('insertMany', async function (next, docs) {
    const users = docs;
    if (Array.isArray(users) && users.length) {
        const hashedUsers = await Promise.all(users.map(async (user) => {
            user.password = await bcryptjs_1.default.hash(user.password, 8);
            return user;
        }));
        docs = hashedUsers;
        next();
    }
    else {
        return next(new Error('User list should not be empty')); // lookup early return pattern
    }
});
exports.User = (0, mongoose_1.model)('User', userSchema);
exports.default = exports.User;
//# sourceMappingURL=user.model.js.map