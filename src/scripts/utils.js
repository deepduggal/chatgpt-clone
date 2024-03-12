/**
 * Reusable utilities
 */
export const utils = {
  /**
   * Convert a Map to an object
   * @param {Map} map - The map to convert
   * @returns {Object} - The object
   */
  mapToObject(map) {
    const obj = Object.create(null);
    for (let [k, v] of map) {
      obj[k] = v;
    }
    return obj;
  },

  /**
   * Convert an object to a Map
   * @param {Object} obj - The object to convert
   * @returns {Map} - The map
   */
  objectToMap(obj) {
    const map = new Map();
    for (let k of Object.keys(obj)) {
      map.set(k, obj[k]);
    }
    return map;
  }

};