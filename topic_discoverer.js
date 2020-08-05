function extractTweetText(text) {
    const splitted = text.split(" ");
    let firstMeaningfulWord = 0;
    while (firstMeaningfulWord < splitted.length && splitted[firstMeaningfulWord].startsWith("@")) {
        firstMeaningfulWord += 1;
    }
    return splitted.slice(firstMeaningfulWord).join(" ");
}

function discoverFromMention(mention) {
    return extractTweetText(mention.text);
}

exports.discoverFromMention = discoverFromMention;
