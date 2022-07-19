/* eslint-disable @typescript-eslint/no-explicit-any */
const pick = (object: any, keys: string[]): object => {
  return keys.reduce((obj: { [key: string]: unknown }, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = object[key];
    }
    return obj;
  }, {});
};

export default pick;
