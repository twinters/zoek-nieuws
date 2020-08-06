const searcherUtil = require('../searcher_util');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://api.tijd.be/services/search/article?q=${topic}&page=0&pageSize=20&lang=nl`);

    if (!rawData) {
        return []
    }

    // Collect article objects
    const articles = [];
    for (const searchResult of rawData.results) {
        articles.push({
            title: searchResult.title,
            date: new Date(searchResult.modified_date),
            content: searchResult.summary,
            url: searchResult.url,
            source: "De Tijd"
        })

    }
    return articles;
}

exports.search = search;

(async () => {
    console.log(await search("test"));
})();
