/*
This class can be used as a test class for the reply mechanism
Provide a "test mention" by running `node bot.js 'test'`, with any text of your liking between the quote marks.
 */

const topicDiscoverer = require("./topic_discoverer");
const newsSelector = require('./news_selector');


const maxNumberOfArticles = 5;

async function mentionReplier(mention) {
    const topic = topicDiscoverer.discoverFromMention(mention);

    const articles = await newsSelector.search(topic, maxNumberOfArticles);
    console.log("Found articles about", topic, ":\n", articles);

    if (articles) {
        return "Hier zijn enkele artikels over \"" + topic + "\":\n"
            + articles.map(a => a.url).slice(0, maxNumberOfArticles).join("\n");
    } else {
        console.log("No articles found");
    }
}

exports.mentionReplier = mentionReplier;

// Test function
(async () => {
    // Create fake mention
    const mockMention = {
        text: process.argv[2] || "@ZoekNieuws dit is een \"test\""
    };

    console.log(await mentionReplier(mockMention))
})();
