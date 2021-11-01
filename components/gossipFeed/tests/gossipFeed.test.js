const mongoose = require('mongoose');

const app = require('../../../app');
const gossipFeedService = require('../gossipFeedService');
const gossipFeedDAL = require('../gossipFeedDAL');
const redisClient = require('../helpers/redisClient');

let userFollowingList;
const expectedUserFollowingList = {
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
};

const cachedUserFollowingList = {
  high_priority_list: ['author_id2'],
  medium_priority_list: ['author_id3'],
  low_priority_list: ['author_id4'],
};

afterAll(() => {
  mongoose.connection.close();
  redisClient.quit();
});

test('retrieving following lists of a specific user', async () => {
  userFollowingList = await gossipFeedService.queryUserFollowingList(
    'author_id6'
  );
  expect(userFollowingList).toMatchObject(expectedUserFollowingList);
});

test('caching User Following List', async () => {
  const isCached = await gossipFeedService.cacheUserFollowingList(
    'author_id6',
    userFollowingList
  );
  expect(isCached).toBe('OK');
});

test('checking whether the data is cached or not', async () => {
  const isUserFollowingListCached =
    await gossipFeedService.isUserFollowingListCached('author_id6');
  expect(isUserFollowingListCached).toMatchObject(cachedUserFollowingList);
});

test('checking whether the non-cached user following list returns null', async () => {
  const isUserFollowingListCached =
    await gossipFeedService.isUserFollowingListCached('author_id0');
  expect(isUserFollowingListCached).toBeNull();
});

test('retrieving user Following List', async () => {
  const retrievedUserFollowingList =
    await gossipFeedService.retrieveUserFollowingList('author_id6');
  expect(retrievedUserFollowingList).toMatchObject(cachedUserFollowingList);
});

test('query cached posts', async () => {
  const arrayOfUsersID = ['author_id10', 'author_id2'];
  const retrievedCachedPosts = await new Promise((resolve, reject) => {
    redisClient.LRANGE('author_id2', 0, -1, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });
  const cachedPosts = await gossipFeedService.queryCachedPosts(arrayOfUsersID);
  expect(cachedPosts).toEqual(retrievedCachedPosts);
});
