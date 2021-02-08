const puppeteer = require("puppeteer");
const { resolve } = require("path");
const { writeFile } = require("fs");

async function searchMangaTags(msg) {
	msg.reply("ok vou procurar todas tags disponíveis.");

	const browser = await puppeteer.launch({
		defaultViewport: null,
		args: ["--start-maximized"],
	});

	const page = await browser.newPage();
	await page.setViewport({ width: 0, height: 0 });
	await page.goto("http://unionmangas.top/mangas/", {
		waitUntil: "networkidle0",
		timeout: 60000,
	});

	console.log("entrei no site");

	const tagModelList = await page.evaluate(() => {
		const nodeList = document.querySelectorAll("ul.dropdown-menu li");

		const tagsArray = [...nodeList];
		const tagModelList = tagsArray.map((tag) => {
			return {
				name: tag.innerText,
				url: tag.firstChild.href,
			};
		});

		return tagModelList;
	});

	const tagsPath = resolve(__dirname, "..", "utils");

	writeFile(
		`${tagsPath}/mangaTags.json`,
		JSON.stringify(tagModelList, null, 2),
		(err) => {
			if (err) throw new Error("Something went wrong with 'mangaTags.json' !");

			msg.reply(
				"tags adicionadas com sucesso! Tente usar o 'gibi tags' para visualizá-las."
			);
		}
	);

	await page.close();

	return console.log("tags adicionadas!");
}

module.exports = searchMangaTags;
