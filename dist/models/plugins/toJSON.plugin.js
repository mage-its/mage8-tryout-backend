"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-param-reassign */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJSON = void 0;
const deleteAtPath = (obj, path, index) => {
    if (index === path.length - 1) {
        delete obj[path[index]];
        return;
    }
    deleteAtPath(obj[path[index]], path, index + 1);
};
const toJSON = (schema) => {
    let transform;
    if (schema.options.toJSON && schema.options.toJSON.transform) {
        transform = schema.options.toJSON.transform;
    }
    schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
        transform(doc, ret, options) {
            Object.keys(schema.paths).forEach((path) => {
                if (schema.paths[path].options && schema.paths[path].options.private) {
                    deleteAtPath(ret, path.split('.'), 0);
                }
            });
            ret.id = ret._id.toString();
            delete ret.__v;
            // delete ret.createdAt;
            // delete ret.updatedAt;
            if (transform) {
                return transform(doc, ret, options);
            }
        },
    });
};
exports.toJSON = toJSON;
exports.default = exports.toJSON;
//# sourceMappingURL=toJSON.plugin.js.map