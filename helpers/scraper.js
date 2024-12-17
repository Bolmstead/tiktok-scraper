require("dotenv").config();
const cron = require("node-cron");
const { Client, IntentsBitField } = require("discord.js");
var player = require("play-sound")((opts = {}));
const olms2074MGClient = require("../MailGunClients/olms2074MGClient");
const sendEmail = require("./sendEmail");
const axios = require("axios"); // Import axios

// Initialize Discord client
// const client = new Client({
//   intents: [
//     IntentsBitField.Flags.Guilds,
//     IntentsBitField.Flags.GuildMembers,
//     IntentsBitField.Flags.GuildMessages,
//     IntentsBitField.Flags.MessageContent,
//   ],
// });

const shitcoinTrackerBotToken = process.env.SHITCOIN_TRACKER_TELEGRAM_BOT_TOKEN;

const botsChatId = process.env.BOTS_TELEGRAM_CHAT_ID;

// const guildId = "1308992895445110824";
const myEmail = ["berkleyo@icloud.com"];

// const channels = {
//   updatedDex: "1308996372942426133", // Channel ID for updated DEX messages
//   coinsBoosted: "1308995954216665108",
//   boostLeaders: "1308997357911801857",
//   walletTracker: "1308996372942426133",
//   ctTracker: "1308997890957512744",
//   tiktokTrends: "1314120287666831400",
// };

// client.login(process.env.DISCORD_TOKEN);

const millisecondsBeforeRerunningScraper = 10 * 60 * 1000;

console.log("**** CONFIG ****");
console.log(
  "millisecondsBeforeRerunningScraper: ",
  millisecondsBeforeRerunningScraper
);

// -------------------

const sendTikTokTeleMessage = async (msg) => {
  try {
    const response = await axios.post(
      `https://api.telegram.org/bot${shitcoinTrackerBotToken}/sendMessage`,
      {
        chat_id: botsChatId,
        message_thread_id: 6,

        text: msg,
      }
    );
    console.log("Message sent:", response.data);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

module.exports = async function scraper(page, pastTrendData = []) {
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
    console.log("trendData.slice(0,1)", trendData.slice(0, 1));
    console.log("pastTrendData.slice(0,1)", pastTrendData.slice(0, 1));

    if (pastTrendData.length > 0) {
      if (
        trendData[0].title == pastTrendData[0].title &&
        trendData[0].numOfPosts == pastTrendData[0].numOfPosts &&
        trendData[1].title == pastTrendData[1].title &&
        trendData[1].numOfPosts == pastTrendData[1].numOfPosts
      ) {
        console.log("TikTok Trends not updated. Running again");
        setTimeout(async () => {
          await scraper(page, trendData);
        }, millisecondsBeforeRerunningScraper);
      } else {
        console.log("TikTok Trends updated!!");

        player.play("successChime.mp3", function (err) {
          if (err) throw err;
        });
        // My Email

        sendEmail(
          olms2074MGClient,
          `Tik Tok Trends Updated!`,
          myEmail,
          process.env.OLMS2074_MAILGUN_EMAIL
        );
        console.log("Extracted card data:", trendData);
        let tiktokMessage1 = `---------- Top TikTok Trends ----------`;
        let tiktokMessage2 = `
    .`;
        let tiktokMessage3 = `
    .`;
        let tiktokMessage4 = `
    .`;
        let tiktokMessage5 = `
    .`;
        let tiktokMessage6 = `
    .`;
        let tiktokMessage7 = `
    .`;
        let tiktokMessage8 = `
    .`;
        let tiktokMessage9 = `
    .`;
        let tiktokMessage10 = `
    .
    
    To view an analysis of each of these trends, go to https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en`;

        for (let [index, trend] of trendData.entries()) {
          let ranking = index + 1;

          tiktokMessage1 = `${tiktokMessage1}
${ranking}: ${trend.title} - ${trend.numOfPosts} Posts`;
          //           } else if (ranking > 10 && ranking <= 20) {
          //             tiktokMessage2 = `${tiktokMessage2}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 20 && ranking <= 30) {
          //             tiktokMessage3 = `${tiktokMessage3}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 30 && ranking <= 40) {
          //             tiktokMessage4 = `${tiktokMessage4}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 40 && ranking <= 50) {
          //             tiktokMessage5 = `${tiktokMessage5}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 50 && ranking <= 60) {
          //             tiktokMessage6 = `${tiktokMessage6}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 60 && ranking <= 70) {
          //             tiktokMessage7 = `${tiktokMessage7}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 70 && ranking <= 80) {
          //             tiktokMessage8 = `${tiktokMessage8}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 80 && ranking <= 90) {
          //             tiktokMessage9 = `${tiktokMessage9}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
          //           } else if (ranking > 90 && ranking <= 100) {
          //             tiktokMessage10 = `${tiktokMessage10}${ranking}: ${trend.title} - ${trend.numOfPosts} Posts
          // `;
        }

        tiktokMessage1 = `${tiktokMessage1}
        
To view an analysis of each of these trends, go to https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en`;

        console.log(tiktokMessage1);

        sendTikTokTeleMessage(tiktokMessage1);

        setTimeout(async () => {
          await scraper(page, trendData);
        }, millisecondsBeforeRerunningScraper);
      }
    } else {
      console.log("Just set Past Trend Data 👍 Running again");

      setTimeout(async () => {
        await scraper(page, trendData);
      }, millisecondsBeforeRerunningScraper);
    } // Wait before rerunning scraper
  } catch (error) {
    console.log(error);
    setTimeout(async () => {
      await scraper(page);
    }, millisecondsBeforeRerunningScraper);
  }
};
