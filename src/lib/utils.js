/**
 * Abstraction class to provide helper functions for core functionalities
 *
 * @class Utils
 */
export default class Utils {
  /**
   * Removes query parameters from url
   *
   *@param {String} url
   * @memberof Utils
   */
  urlWithoutQueryParameters(url) {
    let u = new URL(url);
    return u.origin + u.pathname;
  }
}