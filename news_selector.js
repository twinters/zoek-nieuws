const vrtnu = require('./news_sources/vrt_nws');

const newsSources = [vrtnu];

async function search(topic) {
    return (await Promise.all(newsSources.map(n => n.search(topic)))).flatMap(e=>e)
}

exports.search = search;
