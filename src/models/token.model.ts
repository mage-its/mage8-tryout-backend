import { model, Schema, SchemaTypes } from 'mongoose';

import { tokenTypes } from '../config/tokens';
import TokenInterface from '../interfaces/token.interface';
import { toJSON } from './plugins';

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: [
        tokenTypes.REFRESH,
        tokenTypes.RESET_PASSWORD,
        tokenTypes.VERIFY_EMAIL,
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
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
tokenSchema.plugin(toJSON as (schema: Schema) => void);

export const Token = model<TokenInterface>('Token', tokenSchema);

export default Token;
