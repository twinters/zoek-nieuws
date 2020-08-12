const searcherUtil = require('../searcher_util');
const $ = require('cheerio');
const moment = require('moment');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://www.nrc.nl/search/api/v1/article/search?query=${topic}&from=0&size=8&article_type=alle_artikelen&aggregations%5B%5D=rubric&aggregations%5B%5D=dossier`);


    if (!rawData || !rawData.hits || !rawData.hits.length) {
        return []
    }

    // Collect article objects
    const articles = [];
    for (const hit of rawData.hits) {

        const searchResult = hit.source;

        // Check if it is an article by checking if it has a date
        if (searchResult.published_at) {
            articles.push({
                title: searchResult.headline,
                date: new Date(searchResult.published_at),
                summary: searchResult.abstract,
                url: searchResult.url,
                source: searchResult.publication
            })

        }

    }
    return articles;
}


exports.search = search;
