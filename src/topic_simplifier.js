const fs = require('fs');

const unigrams = {};

try {
    rawUnigramData = fs.readFileSync(__dirname + '/../data/unigrams.tsv');
    lines = rawUnigramData.toString().split("\n");
    for (const line of lines) {
        const splitted = line.split("\t")
        unigrams[splitted[0].trim()] = parseInt(splitted[1]);
    }
} catch (err) {
    console.error(err);
}

const wordRegex = /^([A-Za-z0-9&_-]*)+$/;

function simplifyTopic(topic) {
    const splitted = topic.split(" ").filter(word => wordRegex.test(word));

    const frequencies = splitted.map(word => unigrams[word]);
    const highestFrequency = Math.max.apply(Math, frequencies);

    if (highestFrequency > 0) {
        const filtered = splitted.filter(word => !unigrams[word] || unigrams[word] < highestFrequency);
        return filtered.join(" ");
    } else {
        return false;
    }
}

exports.simplifyTopic = simplifyTopic;
