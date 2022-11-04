"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const models_1 = require("../models");
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
(async () => {
    await mongoose_1.default.connect(process.env.MONGODB_URL, {});
    console.log('Connected to MongoDB');
    const users = await models_1.User.find({ finished: true });
    console.log('Users found');
    for (const user of users) {
        user.finished = false;
        await user.save();
    }
    console.log('Finished Reset');
    mongoose_1.default.disconnect();
})();
//# sourceMappingURL=resetFinished.js.map