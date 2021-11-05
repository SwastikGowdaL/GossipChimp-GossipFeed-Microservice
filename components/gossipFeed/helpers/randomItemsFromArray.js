const { pickSome } = require('pick-some');

const randomItemFromArray = (array, numberOfItems) =>
  pickSome(numberOfItems, array);

module.exports = randomItemFromArray;
