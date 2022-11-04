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
    const teams = await models_1.Team.find({ pass: false });
    console.log('Teams found');
    for (const team of teams) {
        team.pass = true;
        await team.save();
    }
    console.log('Finished Set All Team Pass');
    mongoose_1.default.disconnect();
})();
//# sourceMappingURL=setPassAll.js.map