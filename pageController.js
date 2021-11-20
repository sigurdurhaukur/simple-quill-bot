const quill = require("./scrapers/quill");

async function scrapeAll(browserInstance) {
  let browser;
  try {
    browser = await browserInstance;
    let scrapedData = {};
    // Call the scraper for different set of articles to be scraped

    console.log("Can't stop me now!");

    scrapedData["Quill"] = await quill.scraper(browser, "Innlent");

    // await browser.close();
  } catch (err) {
    console.log("Could not resolve the browser instance => ", err);
  }
}

module.exports = (browserInstance) => scrapeAll(browserInstance);
