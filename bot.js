const getCurrentNumberMilliSeconds = function () {
        return new Date().getTime();
    },

    // Parsing input arguments
    runTimeMinutes = process.argv[2] || 1,
    checkEveryMinutes = process.argv[3] || 5,

    // Determining when to stop
    runTimeMilliSeconds = runTimeMinutes * 60 * 1000,
    endTime = getCurrentNumberMilliSeconds() + runTimeMilliSeconds,

    // Main functionality: replying to new mentions
    replyToNewMentions = function() {
        console.log("To do: replying to new mentions");
    },

    // Main loop: checking for new mentions
    checkForNewMentions = function () {

        // Reply to new mentions for new mentions
        replyToNewMentions();

        // Schedule next check twitterbot
        const currentNumberOfMilliSeconds = getCurrentNumberMilliSeconds();
        console.log(currentNumberOfMilliSeconds, "\n"+endTime);
        if (currentNumberOfMilliSeconds < endTime) {
            setTimeout(checkForNewMentions, checkEveryMinutes * 60 * 1000 )
        } else {
            process.exit();
        }
    };

checkForNewMentions();
