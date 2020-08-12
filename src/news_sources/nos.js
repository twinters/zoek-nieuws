const searcherUtil = require('../searcher_util');
const $ = require('cheerio');
const moment = require('moment');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://nos.nl/zoeken/?q=${searcherUtil.replaceSpaces(topic)}`);

    if (!rawData) {
        return []
    }
    const articles = [];
    $('li.search-results__item', rawData, '#column-main > .search-results').each((index, element) => {

        const title = $(element).find("h3.search-results__title").text().trim();
        const content = $(element).find("div.search-results__description").text().trim();
        const link = "https://nos.nl" + $(element).find("a").attr("href");

        // Time
        const time = new Date($(element).find("time").attr("datetime"));

        articles.push({
            title: title,
            date: time,
            content: content,
            url: link,
            source: "NOS",
        })
    });

    return articles;
}


exports.search = search;

// (async () => {
//     console.log(await search("test"));
// })();
