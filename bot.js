
// Dealing with run duration
const getCurrentNumberMilliSeconds = function () {
        return new Date().getTime();
    },

    // Parsing input arguments
    runTimeMinutes = process.argv[2] || 1,
    checkEveryMinutes = process.argv[3] || 5,

    // Determining when to stop
    runTimeMilliSeconds = runTimeMinutes * 60 * 1000,
    endTime = getCurrentNumberMilliSeconds() + runTimeMilliSeconds;


// Dealing with new mentions
const replyToNewMentions = function () {
    console.log("To do: replying to new mentions");
};


// Main loop: checking for new mentions
const checkForNewMentions = function () {

    // Reply to new mentions for new mentions
    replyToNewMentions();

    // Schedule next check twitterbot iteration
    if (getCurrentNumberMilliSeconds() < endTime) {
        setTimeout(checkForNewMentions, checkEveryMinutes * 60 * 1000)
    } else {
        process.exit();
    }
};

checkForNewMentions();
