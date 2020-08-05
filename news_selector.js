const vrtnu = require('./news_sources/vrt_nu');

const newsSources = [vrtnu];

function search (topic) {
    return newsSources.flatMap(n => n.search(topic));
};

exports.search = search;
