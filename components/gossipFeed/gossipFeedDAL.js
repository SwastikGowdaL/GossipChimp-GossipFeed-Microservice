const FollowingList = require('../../models/followingList');
const Users = require('../../models/users');
const Gossip = require('../../models/gossip');

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
      `${userID}_followingList`,
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
    redisClient.GET(`${userID}_followingList`, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

//* query cached posts
const queryCachedPosts = async (userID) =>
  new Promise((resolve, reject) => {
    redisClient.LRANGE(userID, 0, -1, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

//* query user from DB
const queryUserDetails = async (userID) => Users.findById(userID);

//* query post one week's post
const queryPastOneWeekPosts = async (
  authorID,
  yesterdayDate,
  pastOneWeekDate
) =>
  Gossip.find(
    {
      author_id: authorID,
      published_date: {
        $lte: new Date(yesterdayDate),
        $gte: new Date(pastOneWeekDate),
      },
    },
    '_id'
  );

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
  isUserFollowingListCached,
  queryCachedPosts,
  queryUserDetails,
  queryPastOneWeekPosts,
};
