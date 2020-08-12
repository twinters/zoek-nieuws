const searcherUtil = require('../searcher_util');
const $ = require('cheerio');
const moment = require('moment');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://www.apache.be/?s=${searcherUtil.replaceSpaces(topic)}`);

    if (!rawData) {
        return []
    }
    const articles = [];
    $('article.post', rawData, '#content').each((index, element) => {
        const title = $(element).find("h3").text().trim();
        const content = $(element).find("p:not(.archive-item-meta)").first().text().trim();
        const link = $(element).find('a').first().attr('href');

        // Time
        const dateMatches = link.match(/(\d{4})\/(\d{2})\/(\d{2})/);
        const date = new Date(parseInt(dateMatches[1]), parseInt(dateMatches[2]) - 1, parseInt(dateMatches[3]), 0, 0, 0);

        articles.push({
            title: title,
            date: date,
            content: content,
            url: link,
            source: "apache",
        })
    });

    return articles;
}


exports.search = search;
