const helpers = require('../helpers');
const removeElementsFromArray = require('../helpers/removeElementsFromArray');

const userFollowingList = {
  high_priority_list: [
    {
      author_id: 'author_id2',
      interaction_points: 2,
      _id: '617baaa2b1c50acba941beaf',
    },
  ],
  medium_priority_list: [
    {
      author_id: 'author_id3',
      interaction_points: 0,
      _id: '617baaa2b1c50acba941bead',
    },
  ],
  low_priority_list: [
    {
      author_id: 'author_id4',
      interaction_points: 0,
      _id: '617baaa2b1c50acba941bea2',
    },
  ],
};

test('testing convert to array function', async () => {
  const convertedArray = await helpers.convertUserFollowingListToArray(
    userFollowingList
  );
  expect(convertedArray).toMatchObject({
    high_priority_list: ['author_id2'],
    medium_priority_list: ['author_id3'],
    low_priority_list: ['author_id4'],
  });
});

test('testing removing array helper function', async () => {
  const elements = removeElementsFromArray(['1', '2', '3', '4'], 2);
  expect(elements).toEqual(['1', '2']);
});

test('testing checkIfArrayIncludesPostID function for true', async () => {
  const hasLiked = await helpers.checkIfArrayIncludesPostID(
    '61821ec515a10999e48ac935',
    ['61821ec515a10999e48ac935', '61821ec515a10999e48ac978']
  );
  expect(hasLiked).toBe(true);
});

test('testing checkIfArrayIncludesPostID function for false', async () => {
  const hasLiked = await helpers.checkIfArrayIncludesPostID(
    '61821ec515a10999e48ac935',
    ['61821ec515a10999e48ac978']
  );
  expect(hasLiked).toBe(false);
});
