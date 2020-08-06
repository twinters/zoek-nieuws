const searcherUtil = require('../searcher_util');
const $ = require('cheerio');
const moment = require('moment');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://www.standaard.be/zoeken?keyword=${topic}`);

    if (!rawData) {
        return []
    }
    const articles = [];
    $('article', rawData, '.cols-2 > .row > .col > .col__cell > .padder--0x.padder--y0').each((index, element) => {

        const title = $(element).find("h1").text().trim();
        const content = $(element).find(".intro").text().trim();
        const link = $(element).find("a").attr("href");

        // Time
        const time = $(element).find("time").text();
        const momentDate = moment(time, 'DD-MM-YYYY HH:mm:ss');

        articles.push({
            title: title,
            date: momentDate.toDate(),
            content: content,
            url: link,
            source: "De Standaard",
        })
    });

    return articles;
}

exports.search = search;

(async () => {
    console.log(await search("test"));
})();
