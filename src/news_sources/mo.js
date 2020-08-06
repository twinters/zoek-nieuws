const searcherUtil = require('../searcher_util');
const $ = require('cheerio');
const moment = require('moment');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://www.mo.be/search/site/${topic}`);

    if (!rawData) {
        return []
    }
    const articles = [];
    $('div.node-article', rawData, '#block-system-main > .block-inner > .content').each((index, element) => {

        const title = $(element).find("h2").text().trim();
        const content = $(element).find(".content .field-items").text().trim();
        const link = "https://mo.be" + $(element).find("a").attr("href");

        // Time
        const time = new Date($(element).find(".content > .submitted > span").attr("content"));

        articles.push({
            title: title,
            date: time,
            content: content,
            url: link,
            source: "MO*",
        })
    });

    return articles;
}


exports.search = search;

// (async () => {
//     console.log(await search("test"));
// })();
