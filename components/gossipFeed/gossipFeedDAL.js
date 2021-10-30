const FollowingList = require('../../models/followingList');

const redisClient = require('./helpers/redisClient');

const DEFAULT_EXPIRATION = 86400;

//* queries the user following list
const queryUserFollowingList = async (userID) =>
  FollowingList.findOne({
    user_id: userID,
  });

//* caches the user following list
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

//* checking whether the user following list is cached
const isUserFollowingListCached = async (userID) =>
  new Promise((resolve, reject) => {
    redisClient.GET(userID, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
  isUserFollowingListCached,
};
