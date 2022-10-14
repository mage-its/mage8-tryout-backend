"use strict";
/* eslint-disable no-param-reassign */
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
const paginate = (schema) => {
    schema.statics.paginate = async function (filter, options) {
        let sort = '';
        if (options.sortBy) {
            const sortingCriteria = [];
            options.sortBy.split(',').forEach((sortOption) => {
                const [key, order] = sortOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });
            sort = sortingCriteria.join(' ');
        }
        else {
            sort = 'createdAt';
        }
        const limit = options.limit && parseInt(options.limit, 10) > 0
            ? parseInt(options.limit, 10)
            : 10;
        const page = options.page && parseInt(options.page, 10) > 0
            ? parseInt(options.page, 10)
            : 1;
        const skip = (page - 1) * limit;
        const countPromise = this.countDocuments(filter).exec();
        let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);
        docsPromise = docsPromise.exec();
        return Promise.all([countPromise, docsPromise]).then((values) => {
            const [totalResults, results] = values;
            const totalPages = Math.ceil(totalResults / limit);
            const result = {
                results,
                page,
                limit,
                totalPages,
                totalResults,
            };
            return Promise.resolve(result);
        });
    };
};
exports.paginate = paginate;
exports.default = exports.paginate;
//# sourceMappingURL=paginate.plugin.js.map