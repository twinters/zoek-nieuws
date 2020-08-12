# ZoekNieuws

The [@ZoekNieuws Twitterbot](https://twitter.com/ZoekNieuws) aims to give people easy access to recent news about a certain topic.

## Twitterbot usage

When you tag [@ZoekNieuws](https://twitter.com/ZoekNieuws) on Twitter, it will check your tweet for search terms, and otherwise search the tweet you replied to for search terms.
Terms between quote marks will get priority when searching for search terms.

### Example tweets & behaviour
It can look at your own tweet, regardless of whether it is a reply or not
- `@ZoekNieuws test` -> The bot will search for Belgian news using "test" as search term
- `@ZoekNieuws dit is een "tweede test"` -> The bot will search the news using "tweede test" as search term
- `Dit is een "derde test" voor @ZoekNieuws` -> The bot will search the news using "derde test" as search term

But also at the tweet of someone else by replying to it
- `Zijn er nu nergens artikels over deze "hittegolf"?` - reply: `@ZoekNieuws` -> The bot will search for "hittegolf"
- `Waarom staat er niks in de krant over het sportpaleis optreden van de kreuners deze avond?` - reply: `@ZoekNieuws` -> The bot will search for "krant sportpaleis kreuners"
- `Waarom staat er niks in de krant over het sportpaleis optreden van de kreuners deze avond?` - reply: `@ZoekNieuws "sportpaleis kreuners"` -> The bot will search for " sportpaleis kreuners"

The bot will thus look for the "rarest" words to use in its search query. Note that this is often not optimal, and using quote brackets is very much encouraged.

If you're also a developer and feeling adventurous, feel free to optimize the algorithm for better search word extraction and send a pull request with your proposal!

## Origin of the bot

This bot was created out of [a need @ArbiterOfTweets](https://twitter.com/ArbiterOfTweets/status/1290398319026593793) had for easily showing relevant news articles.

## Installation

- Make sure you have [NodeJS](https://nodejs.org/en/) installed
- Run `npm install` in the main directory
- Run `node src/bot.js 'any text here'` to query the bot with any test query

## Adding new news sources

New news sources can easily be added by adding a new Javascript file in the `src/news_sources/` folder.
The module should export a function called `search(topic)` that receives a string topic as input, and returns a list of article objects as results.
These articles have five fields, namely `title` (string), `date` (Date class), `summary` (string), `url` (string) and `source` (string, likely fixed for your news source to be the name of the news outlet).
See other modules in the `src/news_sources/` folder as an example!


## Data note
The unigram data is calculated using the [Dutch Twitter Ngram Trends dataset](https://www.let.rug.nl/gosse/Ngrams/download.html).

## Contributions

Contributions are very welcome.
Adding new news sources (`/src/news_sources`) is especially appreciated!

Fork the repository and update the code, and send a pull request to this repository!
