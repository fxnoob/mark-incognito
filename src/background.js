import "@babel/polyfill";
import ChromeApi from "./lib/chromeApi";
import Db from "./lib/db";

const db = new Db();

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
    this.onIconClick();
    this.interceptRequests();
    this.initContextMenu();
  }

  /**
   * extension icon click handler:- opens option-page to show listing of marked urls.
   *
   * @memberof Main
   */
  onIconClick() {
    chrome.browserAction.onClicked.addListener(tab => {
      this.openHelpPage();
    });
  }

  interceptRequests = () => {
    let types = ["main_frame"];

    let filter = {
      urls: ["<all_urls>"],
      types: types
    };

    chrome.webRequest.onBeforeRequest.addListener(this.redirect, filter, ["blocking"]);
    chrome.webRequest.onCompleted.addListener(this.redirectOnComplete, filter, ["responseHeaders"])
  };

  /**
   * Performs a check on the requested url to see if it marked as Incognito
   *
   * @param {object} details Details object provided by `chrome.webRequest.*` methods
   * @param {function} callback Callback that run if url is marked as Incognito
   * @memberof Main
   */
  performURLChecks = async (details, callback) => {
    const { url, tabId } = details

    const { windowId } = await this.getTabInfo(tabId);
    const currentWindow = await this.getWindow(windowId);

    if (!currentWindow.incognito) {
      const isUrlIncognito = await db.get(url);
      if (isUrlIncognito.hasOwnProperty(url)) {
        callback();
      }
    }
  }

  /**
   * Creates a new tab if a Incognito URL is requested
   *
   * @param {object} details Details object provided by `chrome.webRequest.onBeforeRequest` method
   * @memberof Main
   */
  redirect = async details => {
    this.performURLChecks(details, async () => {
      await this.createIncognitoTab({ url: details.url });
    })
  };

  /**
   * Goes back if a Incognito marked URL has been navigated to
   *
   * @param {object} details Details object provided by `chrome.webRequest.onCompleted` method
   * @memberof Main
   */
  redirectOnComplete = async details => {
    this.performURLChecks(details, () => {
      chrome.tabs.goBack(details.tabId);
    })
  }

  /**
   * Context menu option initialization
   *
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
   * @memberof Main
   */
  onContextMenuClick = (info, tab) => {
    db.set({ [info.linkUrl]: true });
    console.log(info.linkUrl);
  };
}

const main = new Main();
