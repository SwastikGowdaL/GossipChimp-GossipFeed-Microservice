const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../../../app');
const FollowingList = require('../../../models/followingList');
const gossipFeedService = require('../gossipFeedService');

let userFollowingList;

afterAll(() => {
  mongoose.connection.close();
});

test('retrieving following lists of a specific user', async () => {
  userFollowingList = await gossipFeedService.queryUserFollowingList(
    'author_id6'
  );
  expect(userFollowingList).toMatchObject({
    high_priority_list: [
      {
        author_id: 'author_id2',
        interaction_points: 2,
        _id: '617baaa2b1c50acba941beaf',
      },
    ],
    medium_priority_list: [
      {
        author_id: 'author_id3',
        interaction_points: 0,
        _id: '617baaa2b1c50acba941bead',
      },
    ],
    low_priority_list: [
      {
        author_id: 'author_id4',
        interaction_points: 0,
        _id: '617baaa2b1c50acba941bea2',
      },
    ],
  });
});

test('caching User Following List', async () => {
  const isCached = await gossipFeedService.cacheUserFollowingList(
    'author_id6',
    userFollowingList
  );
  expect(isCached).toBe('OK');
});
