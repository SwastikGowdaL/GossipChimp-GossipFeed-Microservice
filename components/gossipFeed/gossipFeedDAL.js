const redis = require('redis');

const FollowingList = require('../../models/followingList');

const redisClient = redis.createClient();
const DEFAULT_EXPIRATION = 86400;

const queryUserFollowingList = async (userID) =>
  FollowingList.findOne({
    user_id: userID,
  });

const cacheUserFollowingList = async (userID, userFollowingList) =>
  new Promise((resolve, reject) => {
    redisClient.SETEX(
      userID,
      DEFAULT_EXPIRATION,
      userFollowingList,
      (error, value) => {
        if (error) reject(error);
        resolve(value);
      }
    );
  });

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
};
