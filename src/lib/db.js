/**
 * Schema class object
 *
 * @export
 * @class Schema
 */
export class Schema {
  constructor() {
    this.data = {
      //urls in trash
      trash: [],
      factory_setting: {
        left: true,
        right: true,
        long_up: false
      }
    };
  }
}

/**
 * Chrome storage abstraction class
 *
 * @export
 * @class Db
 */
export default class Db {
  /**
   * Set a value in storage
   *
   * @param {object} params  key/value pair to be saved
   * @returns {Promise}
   * @memberof Db
   */
  set(params) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.set(params, () => {
          resolve(params);
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Get a value from storage
   *
   * @param {...*} params
   * @returns {Promise}
   * @memberof Db
   */
  get(...params) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(params, items => {
          if (items === undefined) {
            reject(new Error("Error"));
          } else {
            resolve(items);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * get all (key/value)s from storage
   *
   * @returns {Promise}
   * @memberof Db
   */
  getAll = () => {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.get(null, items => {
          if (items === undefined) {
            reject(new Error("Error"));
          } else {
            resolve(items);
          }
        });
      } catch (e) {
        reject(e);
      }
    });
  };

  /**
   * Removes a value from storage
   *
   * @param {(string[]|string)} keyStr Array of or single key
   * @returns {Promise}
   * @memberof Db
   */
  remove(keyStr) {
    return new Promise((resolve, reject) => {
      try {
        chrome.storage.local.remove(keyStr, res => {
          resolve(keyStr);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}
