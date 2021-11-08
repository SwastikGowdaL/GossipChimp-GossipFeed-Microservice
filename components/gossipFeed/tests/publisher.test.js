// const app = require('../../../app');
// const gossipFeedService = require('../gossipFeedService');

const publishers = require('../publishers');

test('testing publisher', async () => {
  await publishers.startPublisher();
  await publishers.readyPostsForFuture('617fc7e5e8bee9ff94617ab1');
});
