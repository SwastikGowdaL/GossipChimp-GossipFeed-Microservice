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
    const postsID = await gossipFeedService.queryReadyPosts(
      requestInfo.userID,
      requestInfo.count
    );
    console.log(postsID);
    const posts = await gossipFeedService.retrieveReadyPosts(postsID);

    await publishers.readyPostsForFuture(requestInfo.userID);
    socket.emit('posts', posts);
  });

  // socket.on('cachePostForFuture', async (requestInfo) => {
  // await publishers.startPublisher();
  // await publishers.readyPostsForFuture('617fc7e5e8bee9ff94617ab1');
  // });
});

if (config.ENV !== 'dev') {
  throw new Error('ENV should be changed to dev');
}

server.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
