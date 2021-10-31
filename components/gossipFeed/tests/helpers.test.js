const helpers = require('../helpers');

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
