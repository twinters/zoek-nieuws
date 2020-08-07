/*
This class can be used as a test class for the reply mechanism
Provide a "test mention" by running `node bot.js 'test'`, with any text of your liking between the quote marks.
 */

const topicDiscoverer = require("./topic_discoverer");
const newsSelector = require('./news_selector');
const {simplifyTopic, removeUnknownWords} = require("./topic_simplifier");

const maxTopicLength = 30;
const maxNumberOfArticles = 5;

function forceTopicMaxLength(topic) {
    const startTopic = topic;
    while (topic.length > maxTopicLength) {
        topic = simplifyTopic(topic);
    }

    // Check if topic is left, otherwise remove all obscure words & try again
    if (!topic) {
        topic = removeUnknownWords(startTopic);

        while (topic.length > maxTopicLength) {
            topic = simplifyTopic(topic);
        }
    }

    return topic;
}

async function mentionReplier(mention) {
    let topic = topicDiscoverer.discoverFromMention(mention);

    // Make topic shorter
    topic = forceTopicMaxLength(topic);

    // Find topic in tweet above if topic is not found
    if (topic && topic.trim().length === 0 && mention.in_reply_to_status) {
        topic = topicDiscoverer.discoverFromMention(mention.in_reply_to_status);

        topic = forceTopicMaxLength(topic);
    }


    let articles = [];
    while (topic.trim().length > 0 && (!articles || !articles.length)) {
        articles = await newsSelector.search(topic, maxNumberOfArticles);

        // If nothing found, simplify topic by removing frequent words
        if (!articles || !articles.length) {
            topic = simplifyTopic(topic);
        }
    }
    console.log("Found articles about", topic, ":\n", articles);

    if (articles && articles.length) {
        return "Hier zijn enkele artikels over \"" + topic + "\":\n"
            + articles.map(a => a.url).slice(0, maxNumberOfArticles).join("\n");
    } else {
        console.log("No articles found");
    }
}

exports.mentionReplier = mentionReplier;

// Test function
const arg = process.argv[2];
if (require.main === module && arg) {
    (async () => {
        // Create fake mention
        const mockMention = {
            text: arg || "@ZoekNieuws dit is een \"test\""
        };

        console.log(await mentionReplier(mockMention))
    })();
}
