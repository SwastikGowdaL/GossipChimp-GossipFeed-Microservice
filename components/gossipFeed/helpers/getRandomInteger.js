function getRandomInteger(min, max) {
  const minTemp = Math.ceil(min);
  const maxTemp = Math.floor(max);
  return Math.floor(Math.random() * (maxTemp - minTemp + 1)) + min;
}

module.exports = getRandomInteger;
