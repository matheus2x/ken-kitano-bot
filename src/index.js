require("./config/enviroment");
const { Client } = require("discord.js");

const { 
  searchManga,
  searchMangaTags,
  showMangaTags,
} = require("./commands");

const bot = new Client();

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async(msg) => {
  if (msg.content === "gibi ecchi") {
    await searchManga(msg);
  }
})

bot.on("message", async(msg) => {
  if (msg.content === "gibi search tags") {
    await searchMangaTags(msg);
  }
})

bot.on("message", async(msg) => {
  if (msg.content === "gibi tags") {
    await showMangaTags(msg);
  }
})

bot.login(process.env.DISCORD_TOKEN);