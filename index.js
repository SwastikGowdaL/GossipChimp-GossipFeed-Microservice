const socketio = require('socket.io');
const http = require('http');
const app = require('./app');
const config = require('./config/config');

const gossipFeedService = require('./components/gossipFeed/gossipFeedService');
// const { Error } = require('./indexErrors');
const publishers = require('./components/gossipFeed/publishers');

const port = config.PORT;

const server = http.createServer(app);
const io = socketio(server);

publishers.startPublisher();

io.on('connection', (socket) => {
  socket.on('requestPost', async (requestInfo) => {
    if (requestInfo.count === 10) {
      const postsID = await gossipFeedService.queryReadyPosts(
        requestInfo.userID,
        requestInfo.count
      );
      const posts = await gossipFeedService.retrieveReadyPosts(postsID);
      await publishers.readyPostsForFuture(requestInfo.userID);
      socket.emit('posts', posts);
    } else if (requestInfo.count === 30) {
      const postsID = await gossipFeedService.readyPostsForFuture(
        requestInfo.userID,
        30
      );
      const posts = await gossipFeedService.retrieveReadyPosts(
        postsID.slice(0, 20)
      );
      await gossipFeedService.cacheReadyPostsID(
        requestInfo.userID,
        postsID.slice(20, 30)
      );

      socket.emit('posts', posts);
    } else {
      socket.emit('posts', undefined);
    }
  });
});

if (config.ENV !== 'dev') {
  throw new Error('ENV should be changed to dev');
}

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
