import "@babel/polyfill";
import ChromeApi from "./lib/chromeApi";
import Db, { Schema } from "./lib/db";
import Utils from "./lib/utils";

const db = new Db();
const schema = new Schema();
const utils = new Utils();

/**
 * Main extension functionality
 *
 * @class Main
 * @extends {ChromeApi}
 */
class Main extends ChromeApi {
  constructor() {
    super();
    this.ctxMenuId = null;
    this.init();
  }

  /**
   * Initialization of init methods
   * @method
   * @memberOf Main
   */
  init = async () => {
    await this.initDb();
    this.onIconClick();
    this.interceptRequests();
    this.initContextMenu();
  };

  /**
   * initialize default settings
   * @method
   * @memberof Main
   */
  initDb = async () => {
    const res = await db.get("loadedFirstTime");
    if (!res.hasOwnProperty("loadedFirstTime")) {
      await db.set({
        loadedFirstTime: true,
        ...schema.data
      });
    }
  };
  /**
   * extension icon click handler:- opens option-page to show listing of marked urls.
   *
   * @method
   * @memberof Main
   */
  onIconClick = () => {
    chrome.browserAction.onClicked.addListener(tab => {
      this.openHelpPage();
    });
  };

  /**
   * intercept request handler
   *
   * @method
   * @memberof Main
   */
  interceptRequests = () => {
    let types = ["main_frame"];

    let filter = {
      urls: ["<all_urls>"],
      types: types
    };

    chrome.webRequest.onBeforeRequest.addListener(this.redirect, filter, [
      "blocking"
    ]);
    chrome.webRequest.onCompleted.addListener(this.redirectOnComplete, filter, [
      "responseHeaders"
    ]);
  };

  /**
   * Performs a check on the requested url to see if it marked as Incognito
   *
   * @method
   * @param {object} details Details object provided by `chrome.webRequest.*` methods
   * @param {function} callback Callback that run if url is marked as Incognito
   * @memberof Main
   */
  performURLChecks = async (details, callback) => {
    const { url, tabId } = details;

    const urlWithoutQueryParameters = utils.urlWithoutQueryParameters(url);

    const { windowId } = await this.getTabInfo(tabId);
    const currentWindow = await this.getWindow(windowId);

    if (!currentWindow.incognito) {
      const isUrlIncognito = await db.get(urlWithoutQueryParameters);
      if (isUrlIncognito.hasOwnProperty(urlWithoutQueryParameters)) {
        chrome.extension.isAllowedIncognitoAccess(isAllowedIncognito => {
          if (isAllowedIncognito) callback();
        });
      }
    }
  };

  /**
   * Creates a new tab if a Incognito URL is requested
   *
   * @method
   * @param {object} details Details object provided by `chrome.webRequest.onBeforeRequest` method
   * @memberof Main
   */
  redirect = async details => {
    this.performURLChecks(details, async () => {
      await this.createIncognitoTab({ url: details.url });
    });
  };

  /**
   * Goes back if a Incognito marked URL has been navigated to
   *
   * @method
   * @param {object} details Details object provided by `chrome.webRequest.onCompleted` method
   * @memberof Main
   */
  redirectOnComplete = async details => {
    this.performURLChecks(details, async () => {
      chrome.tabs.goBack(details.tabId);
      const { factorySetting } = await db.get("factory_setting");
      if (factorySetting.deleteUrlHistory) {
        this.removeFromHistory(details.url);
      }
    });
  };

  /**
   * Context menu option initialization
   *
   * @method
   * @memberof Main
   */
  initContextMenu = () => {
    if (this.ctxMenuId) return;
    this.ctxMenuId = chrome.contextMenus.create({
      title: "MI %s",
      contexts: ["link"],
      onclick: this.onContextMenuClick
    });
  };

  /**
   * Context menu option click handler
   *
   * @method
   * @param {Object} info info object
   * @param {Object} tab tab object
   * @memberof Main
   */
  onContextMenuClick = (info, tab) => {
    chrome.extension.isAllowedIncognitoAccess(isAllowedIncognito => {
      if (isAllowedIncognito) {
        let url = utils.urlWithoutQueryParameters(info.linkUrl);
        db.set({ [url]: true });
      } else this.openHelpPage();
    });
  };
}

const main = new Main();
