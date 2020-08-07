/*
This class can be used as a test class for the reply mechanism
Provide a "test mention" by running `node bot.js 'test'`, with any text of your liking between the quote marks.
 */

const topicDiscoverer = require("./topic_discoverer");
const newsSelector = require('./news_selector');
const {simplifyTopic} = require("./topic_simplifier");

const maxTopicLength = 30;
const maxNumberOfArticles = 5;

async function mentionReplier(mention) {
    let topic = topicDiscoverer.discoverFromMention(mention);

    while (topic.length > maxTopicLength) {
        topic = simplifyTopic(topic);
    }
    if (topic.trim().length === 0) {
        // TODO: look at tweet above
    }
    

    if (topic.trim().length > 0) {
        const articles = await newsSelector.search(topic, maxNumberOfArticles);
        console.log("Found articles about", topic, ":\n", articles);

        if (articles && articles.length) {
            return "Hier zijn enkele artikels over \"" + topic + "\":\n"
                + articles.map(a => a.url).slice(0, maxNumberOfArticles).join("\n");
        } else {
            console.log("No articles found");
        }
    } else {
        console.log("Empty topic for", mention);
    }
}

exports.mentionReplier = mentionReplier;

// Test function
const arg = process.argv[2];
if (arg) {
    (async () => {
        // Create fake mention
        const mockMention = {
            text: arg || "@ZoekNieuws dit is een \"test\""
        };

        console.log(await mentionReplier(mockMention))
    })();
}
