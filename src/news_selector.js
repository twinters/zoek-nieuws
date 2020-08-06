// Load all news sources from the news_sources folder
const newsSources = {};
const normalizedPath = require("path").join(__dirname, "news_sources");
require("fs").readdirSync(normalizedPath).forEach(function (file) {
    newsSources[file] = require("./news_sources/" + file);
});

// Search function: search for the topic in all searchers
async function search(topic) {
    const newsSourcesSearchers = Object.keys(newsSources).map(k => newsSources[k]);
    const allArticles = (await Promise.all(newsSourcesSearchers.map(n => n.search(topic)))).flatMap(e => e);

    // Sort so most recent article first
    allArticles.sort(function (a, b) {
        return b.date - a.date;
    });

    return allArticles
}

exports.search = search;

(async () => {
    console.log(await search("test"));
})();
