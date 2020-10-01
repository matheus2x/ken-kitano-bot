require("./config/enviroment");
const { Client, MessageEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const randomNum = require("./utils/calculateRandomNumber");

const bot = new Client();

bot.on("ready", () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", msg => {
  if (msg.content === "gibi ecchi") {
    msg.reply("já mando pera aí.");

    (async () => {
      const browser = await puppeteer.launch({
        defaultViewport: null, 
        args: [ "--start-maximized" ],
      });
      const page = await browser.newPage();
      await page.setViewport({ width: 0, height: 0 });
      await page.goto(`https://unionmangas.top/lista-mangas/ecchi/${randomNum(1, 33)}`, {
        waitUntil: "networkidle0",
        timeout: 60000,
      });
      msg.reply("to no site já. Vou escolher um top pra você.");

      const randomMangaPage = await page.evaluate(() => {
        const nodeLists = document.querySelectorAll("img.img-thumbnail");

        const calculateRandomFromInterval = (min, max) => {
          return Math.floor(Math.random() * (max - min + 1) + min);
        }

        const mangaInterval = calculateRandomFromInterval(0, 39);

        const randomManga = nodeLists[mangaInterval]
        const randomMangaPage = randomManga.closest("a").href;
        return randomMangaPage;
      })

      await page.waitFor(4000);

      await page.goto(randomMangaPage, {waitUntil: "networkidle0", timeout: 60000});
      msg.reply("escolhi seu gibi, agr to montando ele.");
      await page.waitFor(8000);
      
      const gibi = await page.evaluate(() => {
        const gibi = {
          image: document.querySelector("img.img-thumbnail").src,
          title: document.querySelectorAll("h2")[0].innerText ,
          description: document.querySelector("div.panel-body").innerText,
        }
        return gibi;
      })
      msg.reply("toma aqui seu gibi:");

      const embed = new MessageEmbed()
        .setTitle(gibi.title)
        .setColor(0xff0000)
        .setImage(gibi.image)
        .setDescription(gibi.description)

      msg.channel.send(embed)

      await page.close();
      
    })()
  }
})

bot.on("message", msg => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});

bot.login(process.env.DISCORD_TOKEN);