function extractTweetText(text) {
    const splitted = text.split(" ");
    let firstMeaningfulWord = 0;
    while (firstMeaningfulWord < splitted.length && splitted[firstMeaningfulWord].startsWith("@")) {
        firstMeaningfulWord += 1;
    }
    return splitted.slice(firstMeaningfulWord).join(" ");
}

const bracketRegex = /["'](.*?)["']/;
function discoverFromMention(mention) {
    // TODO: extract from tweet above using frequency analysis
    const tweetText = extractTweetText(mention.text);

    if (tweetText.match(bracketRegex)) {
        return tweetText.match(bracketRegex)[1]
    }

    return tweetText;
}

exports.discoverFromMention = discoverFromMention;
