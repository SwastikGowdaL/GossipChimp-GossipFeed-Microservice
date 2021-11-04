const dayjs = require('dayjs');

const gossipFeedDAL = require('./gossipFeedDAL');
const helpers = require('./helpers');

dayjs().format();

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

//* queries user details
const queryUserDetails = async (userID) => {
  try {
    return await gossipFeedDAL.queryUserDetails(userID);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

//* checks whether post is liked
const hasLiked = async (postID, arrayOfLikedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfLikedPosts);

//* checks whether post is commented
const hasCommented = async (postID, arrayOfCommentedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfCommentedPosts);

//* checks whether post is regossiped
const hasRegossiped = async (postID, arrayOfRegossipedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfRegossipedPosts);

//* checks whether post is bookmarked
const hasBookmarked = async (postID, arrayOfBookmarkedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfBookmarkedPosts);

//* checks whether post is reported
const hasReported = async (postID, arrayOfReportedPosts) =>
  helpers.checkIfArrayIncludesPostID(postID, arrayOfReportedPosts);

//* checks whether the post is un-interacted or not
const isPostUnInteracted = async (userID, postID) => {
  const userDetails = await queryUserDetails(userID);

  if (await hasLiked(postID, userDetails.liked_gossips)) return false;
  if (await hasCommented(postID, userDetails.commented_gossips)) return false;
  if (await hasRegossiped(postID, userDetails.regossiped_gossips)) return false;
  if (await hasBookmarked(postID, userDetails.bookmarked_gossips)) return false;
  if (await hasReported(postID, userDetails.reported_gossips)) return false;
  return true;
};

//* retrieves un-interacted posts
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

//* retrieve Cached Posts
const retrieveCachedPosts = async (userID, numberOfPosts) => {
  const posts = [];
  const userFollowingList = await retrieveUserFollowingList(userID);

  //* query cached posts of people from high priority list
  const cachedHighPriorityPosts = await queryCachedPosts(
    userFollowingList.high_priority_list
  );
  const unInteractedHighPriorityPosts = await retrieveUnInteractedPosts(
    userID,
    cachedHighPriorityPosts,
    numberOfPosts
  );
  if (unInteractedHighPriorityPosts.length === numberOfPosts) {
    return unInteractedHighPriorityPosts;
  }
  posts.push(...unInteractedHighPriorityPosts);

  //* query cached posts of people from medium priority list
  for (let i = 0; i < userFollowingList.medium_priority_list.length; i += 20) {
    const cachedMediumPriorityPosts = await queryCachedPosts(
      userFollowingList.medium_priority_list.slice(i, i + 20)
    );
    const unInteractedMediumPriorityPosts = await retrieveUnInteractedPosts(
      userID,
      cachedMediumPriorityPosts,
      numberOfPosts - posts.length
    );
    posts.push(...unInteractedMediumPriorityPosts);
    if (posts.length === numberOfPosts) return posts;
  }

  //* query cached posts of people from low priority list
  const cachedLowPriorityPosts = await queryCachedPosts(
    userFollowingList.low_priority_list
  );
  const unInteractedLowPriorityPosts = await retrieveUnInteractedPosts(
    userID,
    cachedLowPriorityPosts,
    numberOfPosts - posts.length
  );
  posts.push(...unInteractedLowPriorityPosts);
  return posts;
};

const queryPastOneWeekPosts = async (
  authorID,
  yesterdayDate,
  pastOneWeekDate
) => {
  try {
    let posts = await gossipFeedDAL.queryPastOneWeekPosts(
      authorID,
      yesterdayDate,
      pastOneWeekDate
    );
    const arrayOfPosts = [];
    posts = JSON.parse(JSON.stringify(posts));
    for (const post of posts) {
      arrayOfPosts.push(post._id);
    }
    return arrayOfPosts;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const pastOneWeekPosts = async (userID, numberOfPosts, authors) => {
  const posts = [];
  const yesterdayDate = dayjs().subtract(1, 'day').format();
  const pastOneWeekDate = dayjs().subtract(8, 'day').format();

  for (const authorID of authors) {
    const oneWeekPosts = await queryPastOneWeekPosts(
      authorID,
      yesterdayDate,
      pastOneWeekDate
    );
    posts.push(...oneWeekPosts);
  }

  let unInteractedPosts = [];
  if (posts.length) {
    unInteractedPosts = await retrieveUnInteractedPosts(
      userID,
      posts,
      numberOfPosts
    );
  }

  return unInteractedPosts;
};

const retrievePastOneWeekPosts = async (userID, numberOfPosts) => {
  const posts = [];
  const userFollowingList = await retrieveUserFollowingList(userID);

  //* past one week posts of people from high priority list
  const highPriorityPosts = await pastOneWeekPosts(
    userID,
    numberOfPosts,
    userFollowingList.high_priority_list
  );
  if (highPriorityPosts.length === numberOfPosts) return highPriorityPosts;
  posts.push(...highPriorityPosts);

  //* past one week posts of people from medium priority list
  for (let i = 0; i < userFollowingList.medium_priority_list.length; i += 20) {
    const mediumPriorityPosts = await pastOneWeekPosts(
      userID,
      numberOfPosts - posts.length,
      userFollowingList.medium_priority_list.slice(i, i + 20)
    );
    posts.push(...mediumPriorityPosts);
    if (posts.length === numberOfPosts) return posts;
  }

  //* past one week posts of people from low priority list
  const lowPriorityPosts = await pastOneWeekPosts(
    userID,
    numberOfPosts - posts.length,
    userFollowingList.low_priority_list
  );
  posts.push(...lowPriorityPosts);

  return posts;
};

//* retrieve posts
const retrievePosts = async (userID, numberOfPosts) => {
  let posts = [];

  //* retrieve posts from cache
  posts = await retrieveCachedPosts(userID, numberOfPosts);
  if (posts.length === numberOfPosts) return posts;

  //* retrieve posts from past one week
  const pastWeekPosts = await retrievePastOneWeekPosts(
    userID,
    numberOfPosts - posts.length
  );
  posts.push(...pastWeekPosts);
  if (posts.length === numberOfPosts) return posts;

  // TODO: create random posts accessing function and refactor code to handle cases like -
  // TODO: 1. handle if high_priority_list and low_priority_list is empty
  // TODO: 2. handle function returning null from database or empty arrays etc..,
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
  retrieveCachedPosts,
  retrievePastOneWeekPosts,
};
