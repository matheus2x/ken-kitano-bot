const mangaTagsData = require("../utils/mangaTags.json");

async function showMangaTags(msg) {

  const tagsName = mangaTagsData.map((tag) => {
    return tag.name;
  })

  return msg.channel.send(tagsName);

}

module.exports = showMangaTags;