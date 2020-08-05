const topicDiscoverer = require("./topic_discoverer");
const replyToNewMentions = require("./twitter_access").replyToNewMentions;
const executeEveryCoupleMinutes = require('./execute_loop').executeEveryCoupleMinutes;
const newsSelector = require('./news_selector');

// Dealing with run duration
const runTimeMinutes = process.argv[2] || 1,
    checkEveryMinutes = process.argv[3] || 5;


const maxNumberOfArticles = 5;

function mentionReplier(mention) {
    const topic = topicDiscoverer.discoverFromMention(mention);

    const articles = newsSelector.search(topic, maxNumberOfArticles);
    console.log("Found articles about ", topic, ":\n", articles);

    return "Hier zijn enkele artikels over '" + topic + "':\n"
        + articles.slice(0, maxNumberOfArticles).join("\n");
}

executeEveryCoupleMinutes(runTimeMinutes, checkEveryMinutes, replyToNewMentions(mentionReplier));
