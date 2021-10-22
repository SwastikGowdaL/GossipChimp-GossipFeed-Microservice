const express = require('express');

const gossipFeedController = require('./gossipFeedController');

const router = new express.Router();

//* router for caching posts
router.post('/cachingGossips', gossipFeedController);

//* router for loading posts
router.post('/gossipFeeds', gossipFeedController);

module.exports = router;
