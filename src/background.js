import "@babel/polyfill";
import ChromeApi from "./lib/chromeApi";
import Db from "./lib/db";

const db = new Db();

class Main extends ChromeApi {
  constructor() {
    super();
    this.ctxMenuId = null;
    this.onIconClick();
    this.interceptRequests();
    this.initContextMenu();
  }

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

    chrome.webRequest.onBeforeRequest.addListener(this.redirect, filter, [
      "blocking"
    ]);
  };

  redirect = async details => {
    console.log({ details });
    let url = details.url;
    const tab = await this.getTabInfo(details.tabId);
    const currentWindow = await this.getWindow(tab.windowId);
    if (currentWindow.incognito === true)
      return {
        redirectUrl: url
      };
    else {
      const isUrlIncognito = await db.get(url);
      if (isUrlIncognito.hasOwnProperty(url)) {
        await this.createIncognitoTab({ url: url });
        return {
          redirectUrl: details.hasOwnProperty("initiator")
            ? details.initiator
            : ""
        };
      } else {
        return {
          redirectUrl: url
        };
      }
    }
  };

  initContextMenu = () => {
    if (this.ctxMenuId) return;
    this.ctxMenuId = chrome.contextMenus.create({
      title: "IW %s",
      contexts: ["link"],
      onclick: this.onContextMenuClick
    });
  };

  onContextMenuClick = (info, tab) => {
    db.set({ [info.linkUrl]: true });
    console.log(info.linkUrl);
  };
}

const main = new Main();
