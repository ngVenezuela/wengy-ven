'use strict';

const FeedParser = require('feedparser');
const request = require('request');
const fs = require('fs');
const config = require('../config/config');
const events = require('events');

let feedparser = new FeedParser();
let eventEmitter = new events.EventEmitter();
let articles = [];
let lastPubDate;
let req;

setInterval(readLastPubDate, 60000 * 60 * 24); // check daily

module.exports = eventEmitter;

/**
 * Check the blog feed for entries
 */
function makeRequest() {
  req = request(config.blogFeedUrl);

  /**
   * We listen to the error event,
   * in case there is an error with
   * the request.
   */
  req.on('error', (err) => {
    feedparser.emit('error', new Error(err));
  });

  /**
   * Listening to the response event,
   * if it's an error, we emit an error, otherwise
   * we pipe the stream to feedparser object.
   */
  req.on('response', (res) => {
    if (res.statusCode !== 200) {
      feedparser.emit('error', new Error('Bad status code'));
    } else {
      req.pipe(feedparser);
    }
  });
}

/**
 * Read the last article publication date
 * from the config/last-blog-pubDate.json file.
 */
function readLastPubDate() {
  try {
    let data = fs.readFileSync('./config/last-blog-pubDate.json', 'utf8');
    let parsed = JSON.parse(data);
    lastPubDate = new Date(parsed.lastPubDate);
    makeRequest();
  } catch (err) {
    feedparser.emit('error', new Error(err));
  }
}

/**
 * It updates the config/last-blog-pubDate.json
 * file with the last article publication date
 */
function lookupFinished() {
  if (articles.length > 0) { // assuming that first item is latest
    try {
      fs.writeFileSync(
        './config/last-blog-pubDate.json',
        JSON.stringify({'lastPubDate': articles[0].pubDate}),
        'utf8'
      );
      lastPubDate = undefined;
      eventEmitter.emit('newArticles', articles);
      articles = [];
    } catch (err) {
      feedparser.emit('error', new Error('Could not save file'));
    }
  }
};

/**
 * we print errors in console.
 * we capture 'lookupFinished' 'error' and
 * execute corresponding function.
 */
feedparser.on('error', (error) => {
  if (error === 'lookupFinished') {
    lookupFinished();
  } else {
    console.log('error emitted: ', error);
  }
});

/**
  * If we get here, it means all of the
  * blog entries are not yet posted in
  * the telegram group
  */
feedparser.on('end', () => {
  if (lastPubDate !== undefined) {
    feedparser.emit('error', 'lookupFinished');
  }
});

/**
 * This function is executed, every time that an
 * entry is found in the xml.
 * It is also assumed that articles are fetched
 * from latest to oldest.
 */
feedparser.on('readable', () => {
  let item;

  if (lastPubDate !== undefined) {
    while (item = feedparser.read()) {
      let itemPubDate = new Date(item.pubDate);
      if (itemPubDate <= lastPubDate) {
        /**
         * This is the only way we can get
         * out of the loop, is not an actual error.
         */
        feedparser.emit('error', 'lookupFinished');
      } else {
        articles.push({
          title: item.title,
          author: item.author,
          link: item.link,
          pubDate: item.pubDate,
        });
      }
    }
  }
});
