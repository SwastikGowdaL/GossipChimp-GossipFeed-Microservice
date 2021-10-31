const convertToArray = require('./convertToArray');

const convertUserFollowingListToArray = async (followingList) => {
  const convertedArray = {};
  convertedArray.high_priority_list = await convertToArray(
    followingList.high_priority_list
  );
  convertedArray.medium_priority_list = await convertToArray(
    followingList.medium_priority_list
  );
  convertedArray.low_priority_list = await convertToArray(
    followingList.low_priority_list
  );
  return convertedArray;
};

module.exports = convertUserFollowingListToArray;
