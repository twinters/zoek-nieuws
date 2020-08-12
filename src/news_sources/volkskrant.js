const searcherUtil = require('../searcher_util');

const cheerio = require('cheerio');
const $ = cheerio;

async function search(topic) {
    const rawData = await searcherUtil.searchRaw(`https://www.volkskrant.nl/search?query=${searcherUtil.replaceSpaces(topic)}`);

    if (!rawData) {
        return []
    }
    const articles = [];
    $('article', rawData, '#main-content > .list-container').each((index, element) => {

        const title = $(element).find("h3").text().trim();
        const link = "https://www.volkskrant.nl" + $(element).find("a").attr("href");

        // Time
        const time = new Date($(element).find(".content > .submitted > span").attr("content"));

        articles.push({
            title: title,
            url: link,
            source: "De Volkskrant",
        })
    });

    // Select top articles, and scrape those dates (as not provided in search)
    const selectedArticles = articles.slice(0, 10);

    (await Promise.all(selectedArticles.map(article => addDateAndContent(article)) ));

    return selectedArticles;
}
async function addDateAndContent(article) {
    const rawPage =  await searcherUtil.searchRaw(article.url);

    const $ = cheerio.load(rawPage);

    article.date = new Date($("meta[property='article:published_time']").attr("content"));
    article.content = $("p.artstyle__intro").text();
    return article;
}


exports.search = search;

(async () => {
    console.log(await search("mondmasker test"));
})();
