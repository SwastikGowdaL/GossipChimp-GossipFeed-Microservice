const FollowingList = require('../../../models/followingList');

async function testing() {
  try {
    const followingNewPerson = new FollowingList({
      user_id: 'user_id1',
    });

    const a = await followingNewPerson.save();
    await FollowingList.updateOne(
      {
        _id: a._id,
      },
      {
        $push: {
          'following_list.medium_priority_list': {
            author_id: 'author_id2',
          },
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
}

// test('retrieve Random Posts', async () => {
//   const randomPosts = await gossipFeedService.retrieveRandomPosts(
//     '617fc7e5e8bee9ff94617ab1',
//     5
//   );
//   console.log(randomPosts);
//   expect(randomPosts).toEqual([]);
// });

// test('random item from database', async () => {
//   const randomItem = await gossipFeedDAL.queryRandomPost('author_id2');
//   console.log(randomItem);
//   expect(randomItem).toMatchObject({});
// });
