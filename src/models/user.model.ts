/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcryptjs';
import { FilterQuery, Model, model, Schema } from 'mongoose';

import { roles } from '../config/roles';
import UserInterface from '../interfaces/user.interface';
import { paginate, toJSON } from './plugins';
import { QueryOption } from './plugins/paginate.plugin';

export interface UserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
}

export interface UserModel extends Model<UserInterface, unknown, UserMethods> {
  isUsernameTaken(username: string, excludeUserId?: string): Promise<boolean>;
  paginate: (
    filter: FilterQuery<unknown>,
    options: QueryOption
  ) => Promise<void>;
  toJSON: (schema: Schema) => void;
}

const userSchema = new Schema<UserInterface, UserModel, UserMethods>(
  {
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
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error(
            'Password must contain at least one letter and one number'
          );
        }
      },
      private: true, // used by the toJSON plugin
    },
    team: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Team',
    },
    school: {
      type: String,
      enum: ['SMA', 'SMK'],
      required: true,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    answers: {
      type: [Schema.Types.Mixed],
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON as (schema: Schema) => void);
userSchema.plugin(paginate);

userSchema.statics.isUsernameTaken = async function (
  username: string,
  excludeUserId?: string
) {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = model<UserInterface, UserModel>('User', userSchema);

export default User;
