const searcherUtil = require('../searcher_util');

const $ = require('cheerio');
async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://www.demorgen.be/search?query=${topic.trim().replace(/\s+/g, '+')}`,
        {
            headers: {
                Cookie: process.env.demorgen_cookie,
            }
        });

    if (!rawData) {
        return []
    }
    const articles = [];
    $('article', rawData, '#main-content > .list-container').each((index, element) => {

        const title = $(element).find("h3").text().trim();
        const content = "";
        const link = "https://www.demorgen.be" + $(element).find("a").attr("href");

        // Time
        const time = new Date($(element).find(".content > .submitted > span").attr("content"));

        articles.push({
            title: title,
            date: false,
            content: content,
            url: link,
            source: "De Morgen*",
        })
    });

    return articles.slice(0, 10);
}

exports.search = search;

// (async () => {
//     console.log(await search("test"));
// })();
