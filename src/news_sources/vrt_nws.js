const searcherUtil = require('../searcher_util');

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://search.vrt.be/advancedSearch?i=nws&q=${topic}&highlight=true`);

    if (!rawData || !rawData.results || !rawData.results.length) {
        return []
    }

    // Collect article objects
    const articles = [];
    for (const searchResult of rawData.results) {

        // Check if it is an article by checking if it has a date
        if (searchResult.articleDates && searchResult.articleDates.publicationDate) {
            articles.push({
                title: searchResult.title,
                date: new Date(searchResult.articleDates.publicationDate),
                content: searchResult.content,
                url: searchResult.externalUrl,
                source: "VRT NWS"
            })

        }

    }
    return articles;
}

exports.search = search;

// (async () => {
//     console.log(await search("test"));
// })();
