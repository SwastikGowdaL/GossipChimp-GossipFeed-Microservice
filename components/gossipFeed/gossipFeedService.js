const gossipFeedDAL = require('./gossipFeedDAL');
const helpers = require('./helpers');

//* queries the user following list
const queryUserFollowingList = async (userID) => {
  try {
    let userFollowingDetails = await gossipFeedDAL.queryUserFollowingList(
      userID
    );
    userFollowingDetails = JSON.parse(JSON.stringify(userFollowingDetails));
    return userFollowingDetails.following_list;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//* caches the user following list
const cacheUserFollowingList = async (userID, userFollowingList) => {
  try {
    return await gossipFeedDAL.cacheUserFollowingList(
      userID,
      JSON.stringify(helpers.convertUserFollowingListToArray(userFollowingList))
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//* checking whether the user following list is cached
const isUserFollowingListCached = async (userID) => {
  try {
    const cachedUserFollowingList =
      await gossipFeedDAL.isUserFollowingListCached(userID);
    if (cachedUserFollowingList) return JSON.parse(cachedUserFollowingList);

    return null;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//* retrieve user following list
const retrieveUserFollowingList = async (userID) => {
  try {
    //* check whether userFollowingList cached or not
    let userFollowingList = await isUserFollowingListCached(userID);

    //* if not cached, query it from DB ,cache it and return it
    if (userFollowingList === null) {
      userFollowingList = await queryUserFollowingList(userID);
      const userFollowingListCached = await cacheUserFollowingList(
        userID,
        userFollowingList
      );

      if (userFollowingListCached !== 'OK') {
        console.log('error while caching');
      }

      return helpers.convertUserFollowingListToArray(userFollowingList);
    }

    return userFollowingList;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
  isUserFollowingListCached,
  retrieveUserFollowingList,
};
