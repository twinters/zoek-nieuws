const getCurrentNumberMilliSeconds = function () {
    return new Date().getTime();
};

function executeEveryCoupleMinutes(totalRunTimeMinutes, checkEveryMinutes, replyFunction) {
    // Determining when to stop
    const runTimeMilliSeconds = totalRunTimeMinutes * 60 * 1000,
        endTime = getCurrentNumberMilliSeconds() + runTimeMilliSeconds;

    // Main loop: checking for new mentions
    const checkForNewMentions = function () {

        // Reply to new mentions for new mentions
        replyFunction();

        // Schedule next check twitterbot iteration
        if (getCurrentNumberMilliSeconds() <= endTime) {
            setTimeout(checkForNewMentions, checkEveryMinutes * 60 * 1000)
        } else {
            process.exit();
        }
    };
    checkForNewMentions();
}

exports.executeEveryCoupleMinutes = executeEveryCoupleMinutes;
