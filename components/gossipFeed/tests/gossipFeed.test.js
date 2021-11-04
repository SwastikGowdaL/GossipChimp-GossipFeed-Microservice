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

const expectedUserDetails = {
  name: 'author 6',
  email: 'author6@gmail.com',
  password: 'hello',
  liked_gossips: ['61821ec515a10999e48ac935'],
  commented_gossips: ['61821ec515a10999e48ac567'],
  bookmarked_gossips: ['61821ec515a10999e48ac555'],
  reported_gossips: ['61821ec515a10999e48ac222'],
  regossiped_gossips: ['61821ec515a10999e48ac777'],
  profile_pic: {
    fileId: 'testing',
    url: 'testing',
    service: 'testing',
  },
  cover_pic: {
    fileId: 'testing',
    url: 'testing',
    service: 'testing',
  },
  following: 0,
  followers: 0,
  tagline: 'testing',
  authorized: 'testing',
  notifications: [],
  settings: [],
  __v: 0,
};

afterAll(() => {
  mongoose.connection.close();
  redisClient.quit();
});

test('retrieving following lists of a specific user', async () => {
  userFollowingList = await gossipFeedService.queryUserFollowingList(
    '617fc7e5e8bee9ff94617ab1'
  );
  expect(userFollowingList).toMatchObject(expectedUserFollowingList);
});

test('caching User Following List', async () => {
  const isCached = await gossipFeedService.cacheUserFollowingList(
    '617fc7e5e8bee9ff94617ab1',
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

test('retrieve user details', async () => {
  const userDetails = await gossipFeedService.queryUserDetails(
    '617fc7e5e8bee9ff94617ab1'
  );
  expect(userDetails).toMatchObject(expectedUserDetails);
});

test('testing isPostUnInteracted function for false', async () => {
  const isPostUnInteracted = await gossipFeedService.isPostUnInteracted(
    '617fc7e5e8bee9ff94617ab1',
    '61821ec515a10999e48ac935'
  );
  expect(isPostUnInteracted).toBe(false);
});

test('testing isPostUnInteracted function for true', async () => {
  const isPostUnInteracted = await gossipFeedService.isPostUnInteracted(
    '617fc7e5e8bee9ff94617ab1',
    '61821ec515a10999e48ac771'
  );
  expect(isPostUnInteracted).toBe(true);
});

test('retrieving UnInteracted Posts', async () => {
  const posts = await gossipFeedService.retrieveUnInteractedPosts(
    '617fc7e5e8bee9ff94617ab1',
    [
      '61821ec515a10999e48ac935',
      '61821ec515a10999e48ac567',
      '61821ec515a10999e48ac777',
      '61821ec515a10999e48ac222',
      '61821ec515a10999e48df236',
      '61821ec515a10999e48df209',
      '61821ec515a10999e48df346',
      '61821ec515a10999e48df231',
    ],
    3
  );
  expect(posts).toMatchObject([
    '61821ec515a10999e48df236',
    '61821ec515a10999e48df209',
    '61821ec515a10999e48df346',
  ]);
});

test('retrieve cached Posts', async () => {
  const posts = await gossipFeedService.retrieveCachedPosts(
    '617fc7e5e8bee9ff94617ab1',
    11
  );
  expect(posts).toEqual([
    '61826d52a723c22f51bfd333',
    '61826d45a723c22f51bfd331',
    '61826cfda723c22f51bfd32d',
    '61821eb815a10999e48ac933',
    '618371cd8909afdcf226c52f',
    '618371c08909afdcf226c52d',
    '618371bd8909afdcf226c52b',
    '618371b98909afdcf226c529',
    '61826d23a723c22f51bfd32f',
    '618371ed8909afdcf226c533',
    '618371e88909afdcf226c531',
  ]);
});

test('retrieve past one week posts', async () => {
  const posts = await gossipFeedService.retrievePastOneWeekPosts(
    '617fc7e5e8bee9ff94617ab1',
    3
  );
  expect(posts).toEqual([
    '61821eb815a10999e48ac933',
    '617fa207f6627d2599288c44',
    '617fa207f6627d2599288c42',
  ]);
});

test('retrieve posts', async () => {
  const posts = await gossipFeedService.retrievePosts(
    '617fc7e5e8bee9ff94617ab1',
    14
  );
  expect(posts).toEqual([
    '61826d52a723c22f51bfd333',
    '61826d45a723c22f51bfd331',
    '61826cfda723c22f51bfd32d',
    '61821eb815a10999e48ac933',
    '618371cd8909afdcf226c52f',
    '618371c08909afdcf226c52d',
    '618371bd8909afdcf226c52b',
    '618371b98909afdcf226c529',
    '61826d23a723c22f51bfd32f',
    '618371ed8909afdcf226c533',
    '618371e88909afdcf226c531',
    '61821eb815a10999e48ac933',
    '617fa207f6627d2599288c44',
    '617fa207f6627d2599288c42',
  ]);
});
