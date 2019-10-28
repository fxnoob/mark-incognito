export default class Utils {
  urlWithoutQueryParameters(url) {
    let u = new URL(url);
    return u.origin + u.pathname;
  }
}