const Twit = require('twit');
const {removeInitialTags} = require("./topic_discoverer");

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
            const lastTweetReplyToId = lastTweet.in_reply_to_status_id_str;
            if (lastTweetReplyToId && lastTweetReplyToId + '' !== "NaN") {
                if (lastTweetReplyToId > lastRepliedMentionId) {
                    lastRepliedMentionId = lastTweet.in_reply_to_status_id_str;
                }
            }
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

function mentionIsPurelyInReplyToOtherMention(mention) {
    return mention.in_reply_to_status
        && mention.in_reply_to_status.user.id_str !== ownTwitterId
        && mention.in_reply_to_status.text
            .split(" ")
            .map(word => word.toLowerCase())
            .indexOf(ownTwitterScreenName) > -1
        // Check if tag is really in the text or just in reply tags
        && removeInitialTags(mention.text)
            .split(" ")
            .map(word => word.toLowerCase())
            .indexOf(ownTwitterScreenName) === -1;
}

async function replyToNewMentions(mentionReplier) {
    await findAndSetLastRepliedToMention();
    return function () {
        T.get('statuses/mentions_timeline', {
            count: 100,
            since_id: (lastRepliedMentionId + ''),
        }, async function (err, mentions, response) {
            if (!mentions || !mentions.length) {
                console.error("No mentions found!", err, response.data);
            }

            mentions = mentions.filter(m => parseInt(m.id_str) > lastRepliedMentionId);
            if (err) {
                console.error(err);
                throw err;
            }
            console.log("Mentions:", mentions.length, "\n", mentions.map(m => m.user.screen_name + ": " + m.text));
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
                    if (!mentionIsPurelyInReplyToOtherMention(mention)) {
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
