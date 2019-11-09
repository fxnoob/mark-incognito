const path = require("path");
const puppeteer = require("puppeteer");
const assert = require("assert");

const extensionID = "jlcjobnhmlbigainbeahgmnbbcikbkba";
const extensionPath = path.join(__dirname, "../dist");
let extensionPage = null;
let browser = null;

async function boot() {
  browser = await puppeteer.launch({
    headless: false, // extension are allowed only in head-full mode
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`,
      "--no-sandbox",
      "--disable-setuid-sandbox"
    ]
  });

  const extensionPopupHtml = "option.html";

  extensionPage = await browser.newPage();
  const extPage = `chrome-extension://${extensionID}/${extensionPopupHtml}`;
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
  });

  after(async function() {
    await browser.close();
  });
});
