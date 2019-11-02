/**
 * Abstraction class to interact with the chrome extension API
 *
 * @class ChromeApi
 */
class ChromeApi {
  constructor() {
    this.win = false;
    chrome.windows.onRemoved.addListener(this.onIncognitoWindowClosed);
  }

  /**
   * Get tab info based on it's tab id
   *
   * @method
   * @param {Number} tab id
   * @memberof ChromeApi
   */
  getTabInfo = tabId => {
    return new Promise(resolve => {
      chrome.tabs.get(tabId, tab => {
        resolve(tab);
      });
    });
  };

  /**
   * Create incognito window
   *
   * @method
   * @memberof ChromeApi
   */
  createIncognitoWindow = () => {
    return new Promise((resolve, reject) => {
      chrome.windows.create({ focused: true, incognito: true }, win => {
        resolve(win);
      });
    });
  };

  /**
   * Get window information
   *
   * @method
   *@param {Number} window id
   * @memberof ChromeApi
   */
  getWindow = winId => {
    return new Promise((resolve, reject) => {
      chrome.windows.get(winId, info => {
        resolve(info);
      });
    });
  };

  /**
   * Callback of chrome.windows.onRemoved
   *
   * @method
   *@param {Number} window id
   * @memberof ChromeApi
   */
  onIncognitoWindowClosed = winId => {
    if (this.win) {
      if (this.win.id === winId) this.win = false;
    }
  };

  /**
   * Create new tab in incognito window
   *
   * @method
   *@param {Object} obj Object argument for createIncognitoTab
   * @param {string} obj.url url for the tab
   * @memberof ChromeApi
   */
  createIncognitoTab = async obj => {
    if (!this.win) {
      this.win = await this.createIncognitoWindow();
      const tab = await this.getActiveTab(this.win.id);
      chrome.tabs.update(tab.id, obj);
    } else {
      chrome.tabs.create({
        ...obj,
        selected: true,
        active: true,
        windowId: this.win.id
      });
    }
    chrome.windows.update(this.win.id, { focused: true });
    return true;
  };

  /**
   * Get active tab of the given window
   *
   * @method
   *@param {Number}
   * @memberof ChromeApi
   */
  getActiveTab = winId => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ windowId: winId, active: true }, tabs => {
        resolve(tabs[0]);
      });
    });
  };

  sendMessageToActiveTab = async payload => {
    const tab = await this.getActiveTab();
    chrome.tabs.sendMessage(tab.id, payload);
    return true;
  };

  traverseTabs = callback => {
    chrome.tabs.query({}, tabs => {
      callback(tabs);
    });
  };

  shiftToLeftTab = () => {
    this.traverseTabs(tabs => {
      console.log(tabs, tabs.length, "tabs info");
      let activeTabIndex = -1;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].active) {
          activeTabIndex = i;
          break;
        }
      }
      if (activeTabIndex === 0) {
        chrome.tabs.update(tabs[tabs.length - 2].id, { highlighted: true });
      } else {
        chrome.tabs.update(tabs[activeTabIndex - 1].id, { highlighted: true });
      }
      chrome.tabs.update(tabs[activeTabIndex].id, { highlighted: false });
    });
  };

  shiftToRightTab = () => {
    this.traverseTabs(tabs => {
      let activeTabIndex = -1;
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].active) {
          activeTabIndex = i;
          break;
        }
      }
      if (activeTabIndex === tabs.length - 1) {
        chrome.tabs.update(tabs[0].id, { highlighted: true });
      } else {
        chrome.tabs.update(tabs[activeTabIndex + 1].id, { highlighted: true });
      }
      chrome.tabs.update(tabs[activeTabIndex].id, { highlighted: false });
    });
  };

  closeActiveTab = callback => {
    chrome.tabs.query({ active: true }, tabs => {
      console.log({ tabs });
      var url = tabs[0].url;
      const tabId = tabs[0].id;
      //console.log("URL from main.js", url);
      chrome.tabs.remove(tabId, callback);
    });
  };

  /**
   * Open help page
   *
   * @method
   * @memberof ChromeApi
   */
  openHelpPage = () => {
    let helpTabIsOpened = false;
    let activeTabId = -1;
    const helpUrl = chrome.runtime.getURL("option.html") + "?page=help";
    chrome.tabs.query({}, tabs => {
      for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].url === helpUrl) {
          chrome.tabs.update(tabs[i].id, { highlighted: true });
          helpTabIsOpened = true;
        }
        if (tabs[i].active) {
          activeTabId = tabs[i].id;
        }
      }
      if (!helpTabIsOpened) {
        chrome.tabs.create({ url: helpUrl }, () => {});
      }
      chrome.tabs.update(activeTabId, { highlighted: false });
    });
  };
}

export default ChromeApi;
