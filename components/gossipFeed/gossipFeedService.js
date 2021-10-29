const gossipFeedDAL = require('./gossipFeedDAL');

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

const cacheUserFollowingList = async (userID, userFollowingList) => {
  try {
    return await gossipFeedDAL.cacheUserFollowingList(
      userID,
      JSON.stringify(userFollowingList)
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
};
