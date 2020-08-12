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
    sort(allArticles, topic);

    return allArticles
}

function toWords(input) {
    return input.replace(/[^0-9A-Z ]+/gi, "").toLocaleLowerCase().split(" ");
}

function calculateMatchingWords(article, topicWords) {
    const articleWords = toWords(article.title + " " + article.summary);

    let numberOfMatchingWords = 0;
    for (const word of topicWords) {
        if (articleWords.indexOf(word) >= 0) {
            numberOfMatchingWords += 1;
        }
    }
    return numberOfMatchingWords;
}

function sort(articles, topic) {

    const topicWords = toWords(topic);

    // Calculate number of matching words
    for (const article of articles) {
        article.matchingWords = calculateMatchingWords(article, topicWords);
    }

    articles.sort(function (a, b) {

        if (a.matchingWords !== b.matchingWords) {
            return b.matchingWords - a.matchingWords;
        }

        if (!a.date && !b.date) {
            return 0;
        }
        if (!a.date) {
            return 1;
        }
        if (!b.date) {
            return -1;
        }
        return b.date - a.date;
    });
}

exports.search = search;

(async () => {
    console.log(await search("mondmasker test"));
})();
