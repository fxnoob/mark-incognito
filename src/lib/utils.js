export default class Utils {
  /**
   * extension helper:- function takes url as and input and return url after removing query parameteres.
   *
   * @memberof Utils
   */
  urlWithoutQueryParameters(url) {
    let u = new URL(url);
    return u.origin + u.pathname;
  }
}