const path = require("path");
const puppeteer = require("puppeteer");
const assert = require("assert");
const Constants = require("../contants");
const Utils = require("./util");

const extensionID = Constants.EXTENSION_ID;
const extensionPath = path.join(__dirname, "../dist");
const extensionOptionHtml = "option.html";
const extPage = `chrome-extension://${extensionID}/${extensionOptionHtml}`;
let extensionPage = null;
let browser = null;

async function boot() {
  browser = await puppeteer.launch({
    // slowMo: 250,
    headless: false, // extension are allowed only in head-full mode
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  extensionPage = await browser.newPage();
  await extensionPage.goto(extPage);
}

describe("Extension UI Testing", function() {
  this.timeout(20000); // default is 2 seconds and that may not be enough to boot browsers and pages.
  before(async function() {
    await boot();
  });

  describe("option page home", async function() {
    it("check title", async function() {
      const h1 = "Allow extension in Incognito Mode";
      const extH1 = await extensionPage.evaluate(() =>
        document.querySelector("h1").textContent.trim()
      );
      assert.equal(extH1, h1);
    });
    it("show option ui after enabling extension in incognito", async () => {
      await extensionPage.goto(`chrome://extensions/?id=${extensionID}`);
      extensionPage.evaluate(() =>
        document
          .querySelector("body > extensions-manager")
          .shadowRoot.querySelector("#viewManager > extensions-detail-view")
          .shadowRoot.querySelector("#allow-incognito")
          .shadowRoot.querySelector("#crToggle")
          .click()
      );
      await Utils.sleep(2000);
      await extensionPage.goto(
        `chrome-extension://${extensionID}/${extensionOptionHtml}`
      );
      const h3 = "Mark Incognito";
      const headingID = `#${Constants.OPTION_SCRIPT_HOST_ID} > div > div > header > div > h6`;
      await extensionPage.waitFor(headingID);
      console.log({ headingID });
      const extH3 = await extensionPage.evaluate(headingID => {
        return document.querySelector(headingID).textContent.trim();
      }, headingID);
      console.log({ extH3 });
      assert.equal(extH3, h3);
    });
  });

  after(async function() {
    await browser.close();
  });
});
