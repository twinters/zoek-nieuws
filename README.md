# ZoekNieuws

This Twitterbot aims to give people easy access to recent news about a certain topic.

## Installation

- Make sure you have [NodeJS](https://nodejs.org/en/) installed
- Run `npm install` in the main directory
- Run `node src/bot.js 'any text here'` to query the bot with any test query

## Data note
The unigram data is calculated using the [Dutch Twitter Ngram Trends dataset](https://www.let.rug.nl/gosse/Ngrams/download.html).

## Contributions

Contributions are very welcome. Especially adding new news sources is very much appreciated.
Fork the repository and add your news source to the `/src/news_sources` folder, and send a pull request!
