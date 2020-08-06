const axios = require('axios');

async function search(topic) {
    const rawData = await searchRaw(topic);

    if (!rawData) {
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

async function searchRaw(topic) {
    const url = `https://search.vrt.be/advancedSearch?i=nws&q=${topic}&highlight=true`;

    let rawArticleData = null;
    await (async () => {
        try {
            const response = await axios.get(url);
            rawArticleData = response.data;
        } catch (error) {
            console.log("error in searching vrt nws:", error.response.body);
        }
    })();
    return rawArticleData;
}

exports.search = search;
