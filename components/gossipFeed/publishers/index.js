const amqp = require('amqplib');

const config = require('../../../config/config');

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
const readyPostsForFuture = async (userID) => {
  try {
    await channel.sendToQueue('readyPostsForFuture', Buffer.from(userID));
  } catch (err) {
    console.log(err);
  }
};

//* waiting for the connection to be established
const startPublisher = async () => {
  await connect();
};

module.exports = {
  startPublisher,
  readyPostsForFuture,
};
