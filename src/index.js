require("./config/enviroment");
const { Client, MessageEmbed } = require("discord.js");
const mangaTagsData = require("./utils/mangaTags.json");

const { searchManga, searchMangaTags, showMangaTags } = require("./commands");

const bot = new Client();

const checkTag = (tag) => {
	for (let i = 0; i < mangaTagsData.length; i++) {
		if (mangaTagsData[i].name === tag) {
			return {
				name: mangaTagsData[i].name,
				url: mangaTagsData[i].url,
			};
		}
	}
};

const takeTag = (path) => {
	const pathArr = path.split(" ");
	pathArr.shift();
	pathArr.shift();

	const tag = pathArr.join(" ");

	return tag;
};

bot.on("ready", () => {
	console.log(`Logged in as ${bot.user.tag}!`);
});

bot.on("message", async (msg) => {
	if (msg.content.startsWith("gibi tag", 0)) {
		const tag = {
			name: checkTag(takeTag(msg.content)).name,
			url: checkTag(takeTag(msg.content)).url,
		};

		if (msg.content === `gibi tag ${tag.name}`) {
			console.log("[msg]: tag founded to - ", msg.content);
			await searchManga(msg, tag);
		} else {
			console.error("[msg]: NO TAG FOUNDED TO - ", msg.content);
		}
	}
});

bot.on("message", async (msg) => {
	if (msg.content === "gibi search tags") {
		await searchMangaTags(msg);
	}
});

bot.on("message", async (msg) => {
	if (msg.content === "gibi tags") {
		await showMangaTags(msg);
	}
});

bot.login(process.env.DISCORD_TOKEN);
