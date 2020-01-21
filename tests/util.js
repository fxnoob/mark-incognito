const utils = {
  sleep: miliSenconds => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(miliSenconds);
      }, miliSenconds);
    });
  }
};
module.exports = utils;
