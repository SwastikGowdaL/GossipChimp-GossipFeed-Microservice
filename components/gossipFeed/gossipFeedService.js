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

//* query cached posts
const queryCachedPosts = async (arrayOfUsersID) => {
  const posts = [];
  let cachedPosts;
  for (const userID of arrayOfUsersID) {
    cachedPosts = await gossipFeedDAL.queryCachedPosts(userID);
    if (cachedPosts !== null) {
      posts.push(...cachedPosts);
    }
  }
  return posts;
};

const queryUserDetails = async (userID) => {
  try {
    return await gossipFeedDAL.queryUserDetails(userID);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const hasLiked = async (postID, arrayOfLikedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfLikedPosts);

const hasCommented = async (postID, arrayOfCommentedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfCommentedPosts);

const hasRegossiped = async (postID, arrayOfRegossipedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfRegossipedPosts);

const hasBookmarked = async (postID, arrayOfBookmarkedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfBookmarkedPosts);

const hasReported = async (postID, arrayOfReportedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfReportedPosts);

const isPostUnInteracted = async (userID, postID) => {
  const userDetails = await queryUserDetails(userID);

  if (await hasLiked(postID, userDetails.liked_gossips)) return false;
  if (await hasCommented(postID, userDetails.commented_gossips)) return false;
  if (await hasRegossiped(postID, userDetails.regossiped_gossips)) return false;
  if (await hasBookmarked(postID, userDetails.bookmarked_gossips)) return false;
  if (await hasReported(postID, userDetails.reported_gossips)) return false;
  return true;
};

const retrieveUnInteractedPosts = async (userID, posts, numberOfPosts) => {
  const readyPosts = [];
  for (const post of posts) {
    const postUnInteracted = await isPostUnInteracted(userID, post);
    if (postUnInteracted) {
      readyPosts.push(post);
      if (readyPosts.length === numberOfPosts) return readyPosts;
    }
  }
  return readyPosts;
};

const retrievePosts = async (userID, numberOfPosts) => {
  const userFollowingList = await retrieveUserFollowingList(userID);
  const cachedHighPriorityPosts = await queryCachedPosts(
    userFollowingList.high_priority_list
  );
  const unInteractedPosts = await retrieveUnInteractedPosts(
    userID,
    cachedHighPriorityPosts,
    numberOfPosts
  );
  if (unInteractedPosts.length === 10) {
    return unInteractedPosts;
  }
  return unInteractedPosts;
};

// const readyPosts = async (userID, numberOfPosts) => {
//   const posts = await retrievePosts(userID, numberOfPosts);
// };

module.exports = {
  queryUserFollowingList,
  cacheUserFollowingList,
  isUserFollowingListCached,
  retrieveUserFollowingList,
  queryCachedPosts,
  queryUserDetails,
  isPostUnInteracted,
  retrieveUnInteractedPosts,
  retrievePosts,
};
