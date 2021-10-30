const mongoose = require('mongoose');

const app = require('../../../app');
const gossipFeedService = require('../gossipFeedService');

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

afterAll(() => {
  mongoose.connection.close();
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
  expect(isUserFollowingListCached).toMatchObject(expectedUserFollowingList);
});

test('checking whether the non-cached user following list returns null', async () => {
  const isUserFollowingListCached =
    await gossipFeedService.isUserFollowingListCached('author_id0');
  expect(isUserFollowingListCached).toBeNull();
});

test('retrieving user Following List', async () => {
  const retrievedUserFollowingList =
    await gossipFeedService.retrieveUserFollowingList('author_id6');
  expect(retrievedUserFollowingList).toMatchObject(expectedUserFollowingList);
});