const Twit = require('twit');

const ownTwitterId = 1290769367471403008;

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

// Twitter access
const hasAuthentication = process.env.consumer_key && process.env.consumer_secret && process.env.access_token && process.env.access_token_secret,
    T = hasAuthentication && new Twit({
        consumer_key: process.env.consumer_key,
        consumer_secret: process.env.consumer_secret,
        access_token: process.env.access_token,
        access_token_secret: process.env.access_token_secret,
    });
if (!hasAuthentication) {
    console.log("Warning: no authentication was given")
}

// Dealing with new mentions
const replyToNewMentions = function () {
    T.post('statuses/update', {status: "Test"}, function (err, data, response) {
        console.log("Posted tweet", data.text)
    })
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
