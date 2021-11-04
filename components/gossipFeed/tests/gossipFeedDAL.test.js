const app = require('../../../app');
const gossipFeedDAL = require('../gossipFeedDAL');

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
