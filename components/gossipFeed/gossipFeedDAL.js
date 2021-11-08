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

//* query random post from database
const queryRandomPost = async (userID) =>
  Gossip.aggregate([
    { $match: { author_id: userID } },
    { $sample: { size: 1 } },
  ]);

//* checks whether the post is cached or not
const isPostCached = async (postID) =>
  new Promise((resolve, reject) => {
    redisClient.EXISTS(postID, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

const queryPost = async (postID) => Gossip.findById(postID);

const cachePost = async (postID, post) =>
  new Promise((resolve, reject) => {
    redisClient.SETEX(postID, DEFAULT_EXPIRATION, post, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

const queryCachedReadyPosts = async (userID, start, stop) =>
  new Promise((resolve, reject) => {
    redisClient.LRANGE(`${userID}_readyPosts`, start, stop, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

const cacheReadyPostsIdForFuture = async (userID, postsID) =>
  new Promise((resolve, reject) => {
    redisClient.LPUSH(`${userID}_readyPosts`, postsID, (error, value) => {
      if (error) reject(error);
      redisClient.EXPIRE(`${userID}_readyPosts`, DEFAULT_EXPIRATION);
      resolve();
    });
  });

//* count the number of cached ready gossipsID for specific user
const countOfReadyCachedPostID = async (userID) =>
  new Promise((resolve, reject) => {
    redisClient.LLEN(`${userID}_readyPosts`, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

//* pop one cached gossipID
const popOneCachedPostID = async (userID) =>
  new Promise((resolve, reject) => {
    redisClient.RPOP(`${userID}_readyPosts`, (error, value) => {
      if (error) reject(error);
      resolve(value);
    });
  });

//* trim redis list
const trimCachedList = async (userID, numberOfItems) =>
  new Promise((resolve, reject) => {
    redisClient.LTRIM(
      `${userID}_readyPosts`,
      0,
      numberOfItems,
      (error, value) => {
        if (error) reject(error);
        resolve(value);
      }
    );
  });

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
  isUserFollowingListCached,
  queryCachedPosts,
  queryUserDetails,
  queryPastOneWeekPosts,
  queryRandomPost,
  isPostCached,
  queryPost,
  cachePost,
  queryCachedReadyPosts,
  cacheReadyPostsIdForFuture,
  countOfReadyCachedPostID,
  popOneCachedPostID,
  trimCachedList,
};
