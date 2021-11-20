const scraperObject = {
  url: "https://www.quill.org/session/new",
  email: "the-email@gmail.com",
  password: "the-password1234",
  async scraper(browser, category) {
    let page = await browser.newPage();

    // go to the page url
    await page.goto(this.url);

    await page.waitForSelector(".container.account-form");

    // click on 'login with google' button
    await page.click(".auth-section button");

    // wait until login page loaded
    await page.waitForSelector("input");

    // login using school account
    await page.click("input");
    await page.keyboard.type(this.email, {
      delay: Math.random() * 100 + 121,
    });
    await page.waitForTimeout(Math.random() * 2000 + 821);
    await page.keyboard.press("Enter");

    await page.waitForSelector("input[name=password]", { visible: true });
    await page.focus("input[type=password]");
    await page.waitForTimeout(Math.random() * 2000 + 283);
    await page.keyboard.type(this.password, {
      delay: Math.random() * 100 + 236,
    });
    await page.waitForTimeout(Math.random() * 2000 + 534);
    await page.keyboard.press("Enter");

    // wait until quill home page has loaded
    await page.waitForSelector(".classroom-cards");
    await page.waitForTimeout(Math.random() * 1000 + 534);

    // find 'Laura's English Class' and click on it
    await page.evaluate(() => {
      [...document.querySelectorAll(".classroom-cards .top-section h2")]
        .find((element) => element.innerHTML === "Laura's English Class")
        .click();
    });

    // wait for the class page to load
    await page.waitForSelector(".container");
    await page.waitForTimeout(Math.random() * 1000 + 532);

    await page.click(".activities-container a");

    await startActivity();

    async function startActivity() {
      // wait for the activity to load
      try {
        await page.waitForSelector("section.student");
        await page.waitForTimeout(Math.random() * 500 + 534);
        await page.click("section.student button");

        // if the activity does not load pres the button again
        let textAreaExists = !!(await page.$(".connect-text-area"));
        if (!textAreaExists) await startActivity();
      } finally {
        await page.waitForTimeout(Math.random() * 500 + 534);
        await doActivity();
      }
    }

    async function doActivity() {
      try {
        // wait for the activity to load
        await page.waitForSelector(".student-container");

        let fragments = await page.$eval(
          ".student-container .sentence-fragments",
          (el) => el.innerText
        );
        // let cue = await page.$eval(".cue", (el) => el.innerText);
        let cues = await page.evaluate(() => {
          [...document.querySelectorAll(".cue")];
        });
        let text = fragments.split("\n\n");
        text = `${text[0]} ${capitalize(cue)}, ${unCapitalize(text[1])}`;

        let feedback = await page.$eval(
          ".student-container .student-feedback-container",
          (el) => el.innerText
        );

        // reset the text area
        await page.$eval(".connect-text-area", (el) => (el.innerHTML = ""));

        let cue;
        if (feedback) {
          if (feedback.includes(cues[0])) cue = cues[1];
          else cue = cues[0];
        }

        if (fragments) {
          await page.click(".connect-text-area");
          await page.keyboard.type(text, {
            delay: Math.random() * 50 + 13,
          });
          await page.waitForTimeout(Math.random() * 4000 + 534);
          await page.keyboard.press("Enter");
        }
      } finally {
        await page.click(".content button");
        await page.waitForSelector(".content");
        await page.waitForTimeout(Math.random() * 500 + 534);
        await page.click(".content button");

        let textAreaExists = !!(await page.$(".connect-text-area"));
        let activityCompleted = !!(await page.$(".top-section h1"));
        if (textAreaExists) await doActivity();
        else if (activityCompleted) await completeActivity();
      }
    }

    async function completeActivity() {
      await page.waitForSelector("#results-page");
      await page.waitForTimeout(Math.random() * 500 + 534);

      //   click the 'Back to your dashboard' button
      await page.click(".top-section a");
    }

    function capitalize(str) {
      let capitalized = str.charAt(0).toUpperCase() + str.slice(1);
      return capitalized;
    }
    function unCapitalize(str) {
      let capitalized = str.charAt(0).toLowerCase() + str.slice(1);
      return capitalized;
    }

    // let selectedCategory = await page.$$eval(
    //   ".megamenu-wrapper > ul > li > ul > li > a",
    //   (links, _category) => {
    //     // Search for the element that has the matching text
    //     links = links.map((a) =>
    //       a.textContent.replace(/(\r\n\t|\n|\r|\t|^\s|\s$|\B\s|\s\B)/gm, "") ===
    //       _category
    //         ? a
    //         : null
    //     );
    //     let link = links.filter((tx) => tx !== null)[0];
    //     return link.href;
    //   },
    //   category
    // );

    // navigate to the selected catagory
    // await page.goto(selectedCategory);
    // console.log(`Navigating to ${selectedCategory}...`);

    // wait until page loaded
    // await page.waitForSelector(".article");
    // const results = await page.$$eval(".article", (articles) => {
    //   return articles.map((article) => {
    //     const properties = {};
    //     const titleElement = article.querySelector(".article-block-headline");
    //     const tag = article.querySelector(
    //       'div[class="article-block-kicker"] > a'
    //     ).innerText;
    //     const anchorElement = article.querySelector("a");
    //     const imageElement = article.querySelector("img");

    //     properties.title = titleElement.innerText;
    //     properties.tag = tag;
    //     properties.url = anchorElement.getAttribute("href");
    //     properties.imageUrl = imageElement ? imageElement.src : "";
    //     properties.icon =
    //       "//frettabladid.overcastcdn.com/img/favicon-32x32.9cd52e1aea4a.png";

    //     return properties;
    //   });
    // });

    // goes to the article and selects higher quality img and the actual text
    // for (i = 0; i < results.length; i++) {
    //   await page.goto(results[i].url);
    //   console.log(`Diving in to ${results[i].url}...`);

    //   let img = await page.evaluate(
    //     () => document.querySelector("picture img").src
    //   );
    //   let date = await page.evaluate(
    //     () => document.querySelector(".article-pubdate").innerText
    //   );
    //   let time = await page.evaluate(
    //     () => document.querySelector(".article-pubtime").innerText
    //   );

    //   await page.waitForSelector(".article-body");
    //   let paragraph = await page.evaluate(() =>
    //     [...document.querySelectorAll(".paragraph-block")]
    //       .map((element) => element.innerText)
    //       .join("\n")
    //   );

    //   results[i]._id = i;
    //   results[i].imageUrl = img;
    //   results[i].date = date;
    //   results[i].time = time;
    //   results[i].paragraph = paragraph;
    // }

    return null;
  },
};

module.exports = scraperObject;
