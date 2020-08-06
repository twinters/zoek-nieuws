const vrtnu = require('./news_sources/vrt_nws');

const newsSources = [vrtnu];

async function search(topic) {
    const allArticles = (await Promise.all(newsSources.map(n => n.search(topic)))).flatMap(e => e);

    // Sort so most recent article first
    allArticles.sort(function (a, b) {
        return b.date - a.date;
    });

    return allArticles
}

exports.search = search;
