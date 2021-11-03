const checkIfArrayIncludesPostID = (postID, arrayOfPostID) => {
  if (arrayOfPostID.includes(postID)) return true;
  return false;
};

module.exports = checkIfArrayIncludesPostID;
