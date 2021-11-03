const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  liked_gossips: [
    {
      type: String,
    },
  ],
  commented_gossips: [
    {
      type: String,
    },
  ],
  bookmarked_gossips: [
    {
      type: String,
    },
  ],
  regossiped_gossips: [
    {
      type: String,
    },
  ],
  reported_gossips: [
    {
      type: String,
    },
  ],
  profile_pic: {
    fileId: {
      type: String,
    },
    url: {
      type: String,
    },
    service: {
      type: String,
    },
  },
  cover_pic: {
    fileId: {
      type: String,
    },
    url: {
      type: String,
    },
    service: {
      type: String,
    },
  },
  following: {
    type: Number,
    default: 0,
  },
  followers: {
    type: Number,
    default: 0,
  },
  tagline: {
    type: String,
    required: true,
  },
  authorized: {
    type: String,
  },
  notifications: [
    {
      type: String,
    },
  ],
  settings: [
    {
      type: String,
    },
  ],
});

const users = mongoose.model('Users', usersSchema);

module.exports = users;
