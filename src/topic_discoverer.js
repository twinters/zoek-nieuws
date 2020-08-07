function extractTweetText(text) {
    if (!text) {
        return "";
    }
    const splitted = text.split(" ").filter(word=>!word.startsWith("http"));
    let firstMeaningfulWord = 0;
    while (firstMeaningfulWord < splitted.length && splitted[firstMeaningfulWord].startsWith("@")) {
        firstMeaningfulWord += 1;
    }
    return splitted.slice(firstMeaningfulWord).join(" ");
}

const bracketRegex = /["'](.*?)["']/;

function discoverFromMention(mention) {
    const tweetText = extractTweetText(mention.text)
        // Replace all punctuations
        .replace(/[.,\/#!$;:{}=_`~()]/g, "");

    if (tweetText.match(bracketRegex)) {
        return tweetText.match(bracketRegex)[1]
    }

    return tweetText;
}

exports.discoverFromMention = discoverFromMention;
