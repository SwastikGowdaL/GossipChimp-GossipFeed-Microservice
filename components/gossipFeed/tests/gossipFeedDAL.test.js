const app = require('../../../app');
const gossipFeedDAL = require('../gossipFeedDAL');

const expectedPost = {
  _id: '61826d52a723c22f51bfd333',
  gossip: 'this is the post with a link ',
  likes: [],
  shares: [],
  regossips: [],
  hashtags: ['technology', 'computer'],
  bookmarks: [],
  author_id: 'author_id2',
  author_name: 'author_name',
  author_pic_id: 'author_pic_id',
  author_authorized: true,
  link: 'https://www.google.com',
  published_date: '2021-11-03T11:06:58.952Z',
  comments: [],
  __v: 0,
};

test('query past one week posts', async () => {
  let posts = await gossipFeedDAL.queryPastOneWeekPosts(
    'author_id2',
    '2021-11-3',
    '2021-10-27'
  );
  posts = JSON.parse(JSON.stringify(posts));
  const arrayOfPosts = [];
  for (const post of posts) {
    arrayOfPosts.push(post._id);
  }
  expect(arrayOfPosts).toEqual([
    '617fa207f6627d2599288c44',
    '617fa207f6627d2599288c42',
  ]);
});

test('query past one week posts of user that does not exist ', async () => {
  let posts = await gossipFeedDAL.queryPastOneWeekPosts(
    'author_id100',
    '2021-11-3',
    '2021-10-27'
  );
  posts = JSON.parse(JSON.stringify(posts));
  const arrayOfPosts = [];
  for (const post of posts) {
    arrayOfPosts.push(post._id);
  }
  expect(arrayOfPosts).toEqual([]);
});

test('is post cached (true)', async () => {
  const isPostCached = await gossipFeedDAL.isPostCached(
    '618371ed8909afdcf226c533'
  );
  expect(isPostCached).toBeTruthy();
});

test('is post cached (false)', async () => {
  const isPostCached = await gossipFeedDAL.isPostCached(
    '618371ed8909afdcf226c000'
  );
  expect(isPostCached).toBeFalsy();
});

test('query post', async () => {
  let post = await gossipFeedDAL.queryPost('61826d52a723c22f51bfd333');
  post = JSON.parse(JSON.stringify(post));
  expect(post).toMatchObject(expectedPost);
});

test('caching post', async () => {
  const cachedPost = await gossipFeedDAL.cachePost(
    expectedPost._id,
    JSON.stringify(expectedPost)
  );
  expect(cachedPost).toBeTruthy();
});

test('query Cached Ready Posts', async () => {
  const queryCachedReadyPosts = await gossipFeedDAL.queryCachedReadyPosts(
    '617fc7e5e8bee9ff94617ab1',
    0,
    2
  );
  expect(queryCachedReadyPosts).toEqual([
    '61821eb815a10999e48ac933',
    '61826cfda723c22f51bfd32d',
    '61826d45a723c22f51bfd331',
  ]);
});

test('cache Ready Posts Id For Future', async () => {
  const cacheReadyPostsIdForFuture =
    await gossipFeedDAL.cacheReadyPostsIdForFuture('author_id6', [
      '12345',
      '67890',
    ]);
  expect(cacheReadyPostsIdForFuture).toBe();
});

test('count Of Ready Cached PostID', async () => {
  const countOfReadyCachedPostID = await gossipFeedDAL.countOfReadyCachedPostID(
    '617fc7e5e8bee9ff94617ab1'
  );
  expect(countOfReadyCachedPostID).toBe(2);
});

test('retrieve Cached Post', async () => {
  let post = await gossipFeedDAL.retrieveCachedPost('61826d52a723c22f51bfd333');
  console.log(post);
  post = JSON.parse(post);
  expect(post).toMatchObject({
    _id: '61826d52a723c22f51bfd333',
    gossip: 'this is the post with a link ',
    likes: [],
    shares: [],
    regossips: [],
    hashtags: ['technology', 'computer'],
    bookmarks: [],
    author_id: 'author_id2',
    author_name: 'author_name',
    author_pic_id: 'author_pic_id',
    author_authorized: true,
    link: 'https://www.google.com',
    published_date: '2021-11-03T11:06:58.952Z',
    comments: [],
    __v: 0,
  });
});
