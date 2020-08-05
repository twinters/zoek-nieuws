const replyToNewMentions = require("./twitter_access").replyToNewMentions;
const executeEveryCoupleMinutes = require('./execute_loop').executeEveryCoupleMinutes;

// Dealing with run duration
const runTimeMinutes = process.argv[2] || 1,
    checkEveryMinutes = process.argv[3] || 5;


const mentionReplier = function (mention) {
    return "Test";
};

executeEveryCoupleMinutes(runTimeMinutes, checkEveryMinutes, replyToNewMentions(mentionReplier));
