const convertToArray = require('./convertToArray');

const convertUserFollowingListToArray = (followingList) => {
  const convertedArray = {};
  convertedArray.high_priority_list = convertToArray(
    followingList.high_priority_list
  );
  convertedArray.medium_priority_list = convertToArray(
    followingList.medium_priority_list
  );
  convertedArray.low_priority_list = convertToArray(
    followingList.low_priority_list
  );
  return convertedArray;
};

module.exports = convertUserFollowingListToArray;
