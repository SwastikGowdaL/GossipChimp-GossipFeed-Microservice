const amqp = require('amqplib');

require('../../../db/mongoose');
const config = require('../../../config/config');
const gossipFeedService = require('../gossipFeedService');

let connection;
let channel;

//* establishing a connection to RabbitMQ server
//* then creating a channel using that connection
//* then creating one new queue
const connect = async () => {
  connection = await amqp.connect(config.amqp);
  channel = await connection.createChannel();
  await channel.assertQueue('readyPostsForFuture');
};

//* enqueues message to ready gossips for future use queue
const readyPostsForFuture = async () => {
  try {
    channel.consume('readyPostsForFuture', async (message) => {
      const userID = message.content.toString();
      if (message) {
        try {
          await gossipFeedService.cacheReadyPostsIdForFuture(userID, 5);
          channel.ack(message);
        } catch (err) {
          console.log(err);
        }
      }
    });
  } catch (err) {
    console.log(err);
  }
};

//* waiting for the connection to be established
const startPublisher = async () => {
  await connect();
  await readyPostsForFuture();
};

startPublisher();
