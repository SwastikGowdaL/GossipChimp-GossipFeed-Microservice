const convertToArray = (array) => {
  const convertedArray = [];
  array.forEach((element) => {
    convertedArray.push(element.author_id);
  });
  return convertedArray;
};

module.exports = convertToArray;
