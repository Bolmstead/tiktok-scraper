require("dotenv").config();
const cron = require("node-cron");
const { Client, IntentsBitField } = require("discord.js");

// Initialize Discord client
const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

const guildId = "1308992895445110824";

const channels = {
  updatedDex: "1308996372942426133", // Channel ID for updated DEX messages
  coinsBoosted: "1308995954216665108",
  boostLeaders: "1308997357911801857",
  walletTracker: "1308996372942426133",
  ctTracker: "1308997890957512744",
  tiktokTrends: "1309378362288115723",
};

client.login(process.env.DISCORD_TOKEN);

const millisecondsBeforeRerunningScraper = 5 * 60 * 1000;

console.log("**** CONFIG ****");
console.log(
  "millisecondsBeforeRerunningScraper: ",
  millisecondsBeforeRerunningScraper
);

// -------------------

module.exports = async function scraper(page) {
  try {
    await page.reload({ waitUntil: "networkidle2" });
    console.log("🏁🏁🏁🏁🏁🏁");
    console.log("Scrolling to top after reload...");
    // Scroll to the top of the page
    await page.evaluate(() => {
      window.scrollTo(0, 0);
    });
    console.log("Scrolling to load content...");
    // Human-like scrolling logic
    async function humanLikeScroll(page, maxScrolls) {
      let currentScrollPosition = 0;
      let totalHeight = await page.evaluate(() => document.body.scrollHeight);

      for (let i = 0; i < maxScrolls; i++) {
        let scrollStep = Math.floor(Math.random() * 400) + 300; // Random scroll step
        currentScrollPosition += scrollStep;

        // Scroll by a small increment
        await page.evaluate((scrollY) => {
          window.scrollBy(0, scrollY);
        }, scrollStep);

        console.log(`Scrolled to position: ${currentScrollPosition}`);

        // Wait for random time between 1 and 3 seconds
        await new Promise((resolve) =>
          setTimeout(resolve, Math.floor(Math.random() * 2000) + 1000)
        );

        // Update total height in case more content has loaded
        totalHeight = await page.evaluate(() => document.body.scrollHeight);

        // Break if we've reached the bottom of the page
        if (currentScrollPosition >= totalHeight) {
          console.log("Reached the bottom of the page.");
          break;
        }
      }
    }

    // Scroll 3 times to load all content
    await humanLikeScroll(page, 50);

    // Select all card wrapper elements
    const cardElements = await page.$$("div.CommonDataList_cardWrapper__kHTJP");
    console.log(`Found ${cardElements.length} card elements.`);

    const trendData = [];

    for (const card of cardElements) {
      try {
        // Extract the title text
        const title = await card.$eval(
          ".CardPc_titleText__RYOWo",
          (el) => el.innerText
        );

        // Extract the number of posts
        const numOfPosts = await card.$eval(
          ".CardPc_itemValue__XGDmG",
          (el) => el.innerText
        );

        // // Extract the ranking
        // const ranking = await card.$eval(
        //   ".RankingStatus_rankingIndex__ZMDrH index-mobile_rankingIndex__9mXja",
        //   (el) => el.innerText
        // );

        // Extract the link
        const href = await card.$eval("#hashtagItemContainer", (el) =>
          el.getAttribute("href")
        );
        const fullLink = `https://ads.tiktok.com${href}`;

        // Push the data to the array
        trendData.push({ title, numOfPosts, fullLink });
      } catch (error) {
        console.error("Error extracting data from card:", error);
      }
    }

    console.log("Extracted card data:", trendData);
    let discordMessage1 = `Top TikTok Trends!`;
    let discordMessage2 = "";
    let discordMessage3 = "";
    let discordMessage4 = "";
    let discordMessage5 = "";
    let discordMessage6 = "";
    let discordMessage7 = "";
    let discordMessage8 = "";
    let discordMessage9 = "";
    let discordMessage10 = "";

    for (let [index, trend] of trendData.entries()) {
      let ranking = index + 1;
      if (ranking <= 10) {
        discordMessage1 = `${discordMessage1}
${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts`;
      } else if (ranking > 10 && ranking <= 20) {
        discordMessage2 = `${discordMessage2}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 20 && ranking <= 30) {
        discordMessage3 = `${discordMessage3}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 30 && ranking <= 40) {
        discordMessage4 = `${discordMessage4}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 40 && ranking <= 50) {
        discordMessage5 = `${discordMessage5}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 50 && ranking <= 60) {
        discordMessage6 = `${discordMessage6}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 60 && ranking <= 70) {
        discordMessage7 = `${discordMessage7}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 70 && ranking <= 80) {
        discordMessage8 = `${discordMessage8}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 80 && ranking <= 90) {
        discordMessage9 = `${discordMessage9}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      } else if (ranking > 90 && ranking <= 100) {
        discordMessage10 = `${discordMessage10}${ranking}: [${trend.title}](<${trend.fullLink}>) - ${trend.numOfPosts} Posts
`;
      }
    }
    console.log(discordMessage1);
    console.log(discordMessage2);
    console.log(discordMessage3);
    console.log(discordMessage4);
    console.log(discordMessage5);
    console.log(discordMessage6);
    console.log(discordMessage7);
    console.log(discordMessage8);
    console.log(discordMessage9);
    console.log(discordMessage10);

    const channel = client.channels.cache.get(channels.tiktokTrends);
    if (channel) {
      channel
        .send(discordMessage1)
        .then(channel.send(discordMessage2))
        .then(channel.send(discordMessage3))
        .then(channel.send(discordMessage4))
        .then(channel.send(discordMessage5))
        .then(channel.send(discordMessage6))
        .then(channel.send(discordMessage7))
        .then(channel.send(discordMessage8))
        .then(channel.send(discordMessage9))
        .then(channel.send(discordMessage10));
    } else {
      console.error("Channel not found!");
      setTimeout(async () => {
        await scraper(page);
      }, millisecondsBeforeRerunningScraper); // Wait before rerunning scraper
    }

    setTimeout(async () => {
      await scraper(page);
    }, millisecondsBeforeRerunningScraper); // Wait before rerunning scraper
  } catch (error) {
    console.log(error);
    setTimeout(async () => {
      await scraper(page);
    }, millisecondsBeforeRerunningScraper);
  }
};
