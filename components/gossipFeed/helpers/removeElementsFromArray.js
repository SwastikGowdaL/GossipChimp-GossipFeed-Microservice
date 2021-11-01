const removeElementsFromArray = (array, numberOfElementsToRemove) => {
  for (let i = numberOfElementsToRemove; i > 0; i--) {
    array.pop();
  }
  return array;
};

module.exports = removeElementsFromArray;
