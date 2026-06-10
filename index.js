const axios = require("axios");
require("dotenv").config();
// Import the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});
// Hello command
app.command("/dsb-hello-mj", async ({ command, ack, respond }) => { 
    await ack();
    await respond(`Hello, <@${command.user_id}>!`);
});
// Ping command
app.command("/dsb-ping-mj", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});
(async () => {
  await app.start();
  console.log("bot is running!");
})();
// Cat fact command
app.command("/dsb-catfact-mj", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
// Dog pics command
app.command("/dsb-dogpic-mj", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://dog.ceo/api/breeds/image/random");
    const imageUrl = response.data.message;
    await respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: imageUrl
          }
        },
        {
          type: "image",
          image_url: imageUrl,
          alt_text: "Random dog"
        }
      ]
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a dog pic." });
  }
});
// Cat pics command
app.command("/dsb-catpic-mj", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://api.thecatapi.com/v1/images/search");
    const imageUrl = response.data[0].url;
    await respond({
      blocks: [
        {
          type: "section",
          text: {
          type: "mrkdwn",
          text: imageUrl
          }
        },
        {
          type: "image",
          image_url: imageUrl,
          alt_text: "Random cat"
        }
      ]
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat pic." });
  }
});
//How are you command
app.command("/dsb-howareyou-mj", async ({ ack, respond }) => {
  await ack();
  await respond("I'm doing great, thanks for asking! How about you?");
});
// Joke command
app.command("/dsb-joke-mj", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}
${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
// Echo command
app.command("/dsb-echo-mj", async ({ command, ack, respond }) => {
    await ack();
    await respond(`You said: ${command.text}`);
});
//NASA Astronomy Picture of the Day command
app.command("/dsb-napd-mj", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);
    await respond({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: response.data.explanation
          }
        },
        {
          type: "image",
          image_url: response.data.url,
          alt_text: response.data.title
        }
      ]
    });
  } catch (err) {
    await respond({ text: "Failed to fetch the Astronomy Picture of the Day." });
  }
});
//meme command
app.command("/dsb-meme-mj", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://api.imgflip.com/get_memes");
    const memeUrl = response.data.data.memes[Math.floor(Math.random() * response.data.data.memes.length)].url;
    await respond({
      blocks: [
        {
          type: "image",
          image_url: memeUrl,
          alt_text: "Random Meme"
        }
      ]
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a meme." });
  }
});
// Help command
app.command("/dsb-help-mj", async ({ ack, respond }) => {
    await ack();
    await respond({
        text: "Here are the available commands:\n\n" +
              "1. `/dsb-ping-mj` - Check the bot's latency.\n" +
              "2. `/dsb-echo-mj` - Repeat what you say.\n" +
              "3. `/dsb-hello-mj` - Greet the bot.\n" +
              "4. `/dsb-catfact-mj` - Get a random cat fact.\n" +
              "5. `/dsb-joke-mj` - Get a random joke.\n" +
              "6. `/dsb-help-mj` - Show this help message.\n" +
              "7. `/dsb-dogpic-mj` - Get a random dog picture.\n" +
              "8. `/dsb-catpic-mj` - Get a random cat picture.\n" +
              "9. `/dsb-howareyou-mj` - Ask the bot how it's doing.\n" +
              "10. `/dsb-napd-mj` - View the NASA Astronomy Picture of the Day.\n" +
              "11. `/dsb-meme-mj` - Get a random meme." +
              "\n\nFeel free to try them out!"
    });
})
