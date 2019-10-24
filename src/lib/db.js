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

export default class Db {
  /*
   * set values in db
   * input - {key: value}
   * */
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
  
  /*
   * get values from db
   * input - [key1,key2]
   * */
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
  /*
   * delete key from db
   * input - [key1,key2] or string
   * */
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
