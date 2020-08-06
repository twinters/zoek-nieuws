const axios = require('axios');
const $ = require('cheerio');
const moment = require('moment');

async function search(topic) {
    const rawData = await searchRaw(topic);

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

async function searchRaw(topic) {
    const url = `https://www.standaard.be/zoeken?keyword=${topic}`;

    let rawArticleData = null;
    await (async () => {
        try {
            const response = await axios.get(url);
            rawArticleData = response.data;
        } catch (error) {
            console.log("error in searching de standaard:", error.response.body);
        }
    })();
    return rawArticleData;
}

exports.search = search;

(async () => {
    console.log(await search("test"));
})();
