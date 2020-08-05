const twitterAccess = require("./twitter_access");
const replyToNewMentions = twitterAccess.replyToNewMentions;
const executeEveryCoupleMinutes = require('./execute_loop').executeEveryCoupleMinutes;
const newsSelector = require('./news_selector');

// Dealing with run duration
const runTimeMinutes = process.argv[2] || 1,
    checkEveryMinutes = process.argv[3] || 5;


function extractTweetText(text) {
    const splitted = text.split(" ");
    let firstMeaningfulWord = 0;
    while (firstMeaningfulWord < splitted.length && splitted[firstMeaningfulWord].startsWith("@")) {
        firstMeaningfulWord += 1;
    }
    return splitted.slice(firstMeaningfulWord).join(" ");
}

const maxNumberOfArticles = 5;

function mentionReplier(mention) {
    const mentionTweetTextWords = extractTweetText(mention.text);

    let topic = mentionTweetTextWords;

    const articles = newsSelector.search(topic, maxNumberOfArticles);
    console.log("Found articles about ", topic, ":\n", articles);

    return "Hier zijn enkele artikels over '" + topic + "':\n"
        + articles.slice(0, maxNumberOfArticles).join("\n");
}

executeEveryCoupleMinutes(runTimeMinutes, checkEveryMinutes, replyToNewMentions(mentionReplier));
