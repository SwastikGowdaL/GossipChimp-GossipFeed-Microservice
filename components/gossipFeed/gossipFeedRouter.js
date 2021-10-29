const express = require('express');

const gossipFeedController = require('./gossipFeedController');

const router = new express.Router();

//* router for loading posts
router.post('/gossipFeeds', gossipFeedController);

module.exports = router;
