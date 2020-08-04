const Twit = require('twit');
const ownTwitterId = 1290769367471403008;

// Twitter access
const hasAuthentication = process.env.consumer_key && process.env.consumer_secret && process.env.access_token && process.env.access_token_secret,
    T = new Twit({
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


exports.replyToNewMentions = replyToNewMentions;
