const mongoose = require('mongoose');

const followingListSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  following_list: {
    high_priority_list: [
      {
        author_id: {
          type: String,
        },
        interaction_points: {
          type: Number,
          default: 0,
        },
      },
    ],
    medium_priority_list: [
      {
        author_id: {
          type: String,
        },
        interaction_points: {
          type: Number,
          default: 0,
        },
      },
    ],
    low_priority_list: [
      {
        author_id: {
          type: String,
        },
        interaction_points: {
          type: Number,
          default: 0,
        },
      },
    ],
  },
});

const followingList = mongoose.model('FollowingList', followingListSchema);

module.exports = followingList;
