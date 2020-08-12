const axios = require("axios");

async function searchRaw(url, params={}) {
    let rawArticleData = null;
    await (async () => {
        try {
            const response = await axios.get(url, params);
            rawArticleData = response.data;
        } catch (error) {
            console.log("error in searching ", url, error.response && error.response.body);
        }
    })();
    return rawArticleData;
}

exports.searchRaw = searchRaw;
