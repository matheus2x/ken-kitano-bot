const { MessageEmbed } = require("discord.js");
const puppeteer = require("puppeteer");
const randomNum = require("../utils/calculateRandomNumber");

async function searchManga(msg, { url }) {
	try {
		msg.reply("já mando pera aí.");

		const browser = await puppeteer.launch({
			defaultViewport: null,
			args: ["--start-maximized"],
		});

		const page = await browser.newPage();
		await page.setViewport({ width: 0, height: 0 });

		await page.goto(url, {
			waitUntil: "networkidle0",
			timeout: 60000,
		});

		const lastPageNum = await page.evaluate(() => {
			const pageList = document.querySelectorAll("ul.pagination li");
			const lastPageUrl = pageList[pageList.length - 1].firstElementChild.href;
			const lastPageNum = lastPageUrl.match(/\d/g).join("");

			return lastPageNum;
		});

		await page.goto(`${url}/${randomNum(1, lastPageNum)}`, {
			waitUntil: "networkidle0",
			timeout: 60000,
		});

		console.log("consegui entrar no site.");

		const randomMangaModel = await page.evaluate(() => {
			const calculateRandomFromInterval = (min, max) => {
				return Math.floor(Math.random() * (max - min + 1) + min);
			};

			const nodeList = document.querySelectorAll("img.img-thumbnail");
			const mangaInterval = calculateRandomFromInterval(0, nodeList.length - 1);
			const randomManga = nodeList[mangaInterval];
			const randomMangaModel = randomManga.closest("a").href;

			return randomMangaModel;
		});

		msg.reply("escolhi seu gibi, agora to montando ele.");
		console.log("escolhi seu gibi, agora to montando ele.");

		await page.goto(randomMangaModel, {
			waitUntil: "networkidle0",
			timeout: 60000,
		});

		const manga = await page.evaluate(() => {
			const manga = {
				title: document.querySelector("h2").innerText,
				description: document.querySelector("div.panel-body").innerText,
				image: document.querySelector("img.img-thumbnail").src,
			};
			return manga;
		});

		await msg.reply("toma aqui seu gibi:");

		const embedManga = new MessageEmbed()
			.setTitle(manga.title)
			.setDescription(manga.description)
			.setImage(manga.image)
			.setColor(0xff0000);

		await msg.channel.send({ embed: embedManga });

		await page.close();

		return console.log("gibi enviado!");
	} catch (err) {
		if (err) {
			msg.reply("algo inesperado aconteceu. Tente novamente.");
			throw new Error("Algo de errado aconteceu.");
		}
	}
}

module.exports = searchManga;
