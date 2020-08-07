# ZoekNieuws

This Twitterbot aims to give people easy access to recent news about a certain topic.

## Twitterbot usage

When you tag @ZoekNieuws on Twitter, it will check your tweet for search terms, and otherwise search the tweet you replied to for search terms.
Terms between quote marks will get priority when searching for search terms.

### Example tweets & behaviour
It can look at your own tweet, regardless of whether it is a reply or not
- `@ZoekNieuws test` -> The bot will search for Belgian news using "test" as search term
- `@ZoekNieuws dit is een "tweede test"` -> The bot will search the news using "tweede test" as search term
- `Dit is een "derde test" voor @ZoekNieuws` -> The bot will search the news using "derde test" as search term

But also at the tweet of someone else by replying to it
- `Zijn er nu nergens artikels over deze "hittegolf"?` - reply: `@ZoekNieuws` -> The bot will search for "hittegolf"
- `Waarom staat er niks in de krant over het sportpaleis optreden van de kreuners deze avond?` - reply: `@ZoekNieuws` -> The bot will search for "krant sportplaies kreuners"
- `Waarom staat er niks in de krant over het sportpaleis optreden van de kreuners deze avond?` - reply: `@ZoekNieuws "sportpaleis kreuners"` -> The bot will search for " sportplaies kreuners"

## Installation

- Make sure you have [NodeJS](https://nodejs.org/en/) installed
- Run `npm install` in the main directory
- Run `node src/bot.js 'any text here'` to query the bot with any test query

## Data note
The unigram data is calculated using the [Dutch Twitter Ngram Trends dataset](https://www.let.rug.nl/gosse/Ngrams/download.html).

## Contributions

Contributions are very welcome.
Adding new news sources (`/src/news_sources`) is especially appreciated!

Fork the repository and update the code, and send a pull request to this repository!
