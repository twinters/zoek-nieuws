const Twit = require('twit');

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
const
    findLastRepliedToMention = function () {
        return '123' // TODO
    },
    lastRepliedMentionId = findLastRepliedToMention(),
    replyToNewMentions = function (mentionReplier) {
        return function () {
            T.get('statuses/mentions_timeline', {
                count: 100,
                since_id: lastRepliedMentionId
            }, function (err, mentions, response) {
                if (err) {
                    console.error(err);
                    throw err;
                }
                console.log(mentions);
                for (let mention of mentions) {

                    const mention_id = mention.id_str,
                        mention_username = mention.user.screen_name;

                    // Check if tweet still has id etc
                    if (mention_id && mention_username) {
                        const replyText = mentionReplier(mention);

                        // Check if reply text is generated
                        if (replyText) {
                            T.post('statuses/update',
                                {
                                    in_reply_to_status_id: mention.id_str,
                                    status: "@" + mention_username + " " + replyText
                                },
                                function (err, data, response) {
                                    console.log("Posted tweet", data.text)
                                });
                        } else {
                            console.log("No reply text given");
                        }
                    }

                }
            })
        }
    };


exports.replyToNewMentions = replyToNewMentions;
