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
let lastRepliedMentionId = 1;
const ownTwitterId = '1290769367471403008';
const ownTwitterScreenName = "@zoeknieuws";

async function findAndSetLastRepliedToMention() {
    try {
        const lastTweets = await new Promise((resolve, reject) => {
            T.get('statuses/user_timeline', {
                count: 100,
                user_id: ownTwitterId
            }, function (err, data, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
        for (let lastTweet of lastTweets) {
            lastRepliedMentionId = Math.max(lastRepliedMentionId, parseInt(lastTweet.in_reply_to_status_id_str));
        }
        return lastRepliedMentionId
    } catch (err) {
        console.error("Error while finding last mentioned tweet");
        throw err;
    }
}

async function getTweet(id) {
    try {
        return await new Promise((resolve, reject) => {
            T.get(`statuses/show/${id}`, {}, function (err, data, response) {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    } catch (err) {
        console.error("Error while finding last mentioned tweet");
        throw err;
    }
}

function mentionIsInReplyToOtherMention(mention) {
    return mention.in_reply_to_status && mention.in_reply_to_status.text && mention.in_reply_to_status.text
        .split(" ")
        .map(word => word.toLowerCase()).indexOf(ownTwitterScreenName) > -1;
}

async function replyToNewMentions(mentionReplier) {
    await findAndSetLastRepliedToMention();
    return function () {
        T.get('statuses/mentions_timeline', {
            count: 100,
            since_id: (lastRepliedMentionId + ''),
        }, async function (err, mentions, response) {
            mentions = mentions.filter(m => parseInt(m.id_str) > lastRepliedMentionId);
            if (err) {
                console.error(err);
                throw err;
            }
            console.log("Mentions:", mentions);
            for (let mention of mentions) {
                console.log("Replying to", mention.id_str);

                const mention_id = mention.id_str,
                    mention_username = mention.user.screen_name;

                // Check if tweet still has id etc
                if (mention_id && mention_username) {

                    // Calculate tweet in mention
                    if (mention.in_reply_to_status_id) {
                        mention.in_reply_to_status = await getTweet(mention.in_reply_to_status_id_str);
                    }

                    // Don't reply if the tweet it replies to, is also a mention (to avoid spamming whole chain)
                    if (!mentionIsInReplyToOtherMention(mention)) {
                        const replyText = await mentionReplier(mention);

                        // Check if reply text is generated
                        if (replyText) {
                            T.post('statuses/update',
                                {
                                    in_reply_to_status_id: mention.id_str,
                                    status: "@" + mention_username + " " + replyText
                                },
                                function (err, data, response) {
                                    if (err) {
                                        console.error("Had error", err);
                                    } else {
                                        console.log("Posted tweet", data.text)
                                    }
                                });
                        } else {
                            console.log("No reply text given");
                        }
                    }


                }

                // Update last reply
                lastRepliedMentionId = Math.max(lastRepliedMentionId, parseInt(mention.id_str));

            }
        })
    }
};


exports.replyToNewMentions = replyToNewMentions;
