function removeInitialTags(text) {
    if (!text) {
        return "";
    }
    const splitted = text.split(" ");
    let firstMeaningfulWord = 0;
    while (firstMeaningfulWord < splitted.length && splitted[firstMeaningfulWord].startsWith("@")) {
        firstMeaningfulWord += 1;
    }
    return splitted.slice(firstMeaningfulWord).join(" ")
}

const blocklist = ["msm", "mainstream", "main", "stream", "media",
    "journaal", "nieuws", "nieuw", "krant",
    "lees", "zie",
    "je", "jij", "ik",
    "niet",
    "in", "over", "onder", "met"];

function extractTweetText(text) {
    return removeInitialTags(text)
        .split(" ")
        .filter(word => !word.startsWith("http"))
        .filter(word => word.indexOf("@") < 0)
        .filter(word => blocklist.indexOf(word.toLocaleLowerCase()) < 0)
        .join(" ");
}

const bracketRegex = /["“'](.*?)["”']/;

function discoverFromMention(mention) {
    const tweetText = extractTweetText(mention.full_text)
        // Replace all punctuations
        .replace(/[.,\/#@!$;:{}=_`~()]/g, "")
        // Replace emoji
        .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '')
        .trim();

    const matches = tweetText.match(bracketRegex)
    if (matches) {
        return matches[1]
    }

    return tweetText;
}

exports.discoverFromMention = discoverFromMention;
exports.removeInitialTags = removeInitialTags;
