const { MessageEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const randomNum = require("../utils/calculateRandomNumber");

async function searchManga(msg) {
  msg.reply("já mando pera aí.");

  const browser = await puppeteer.launch({
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 0, height: 0 });
  await page.goto(`https://unionmangas.top/lista-mangas/ecchi/${randomNum(1, 33)}`, {
    waitUntil: "networkidle0",
    timeout: 60000,
  });

  console.log("consegui entrar no site.");

  const randomMangaModel = await page.evaluate(() => {
    const calculateRandomFromInterval = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    const nodeList = document.querySelectorAll("img.img-thumbnail");
    const mangaInterval = calculateRandomFromInterval(0, 39);
    const randomManga = nodeList[mangaInterval];
    const randomMangaModel = randomManga.closest("a").href;

    return randomMangaModel;
  })
  
  msg.reply("escolhi seu gibi, agora to montando ele.");
  console.log("escolhi seu gibi, agora to montando ele.");

  await page.goto(randomMangaModel, {
    waitUntil: "networkidle0",
    timeout: 60000,
  })

  const manga = await page.evaluate(() => {
    const manga = {
      title: document.querySelector("h2").innerText,
      description: document.querySelector("div.panel-body").innerText,
      image: document.querySelector("img.img-thumbnail").src,
    };

    return manga;
  });

  msg.reply("toma aqui seu gibi:");

  const embedManga = new MessageEmbed()
    .setTitle(manga.title)
    .setDescription(manga.description)
    .setImage(manga.image)
    .setColor(0xff0000);

  msg.channel.send({ embed: embedManga });

  await page.close();

  return console.log("gibi enviado!");
}

module.exports = searchManga;