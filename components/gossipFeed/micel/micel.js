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

//* test('retrieve Random Posts', async () => {
//   const randomPosts = await gossipFeedService.retrieveRandomPosts(
//     '617fc7e5e8bee9ff94617ab1',
//     5
//   );
//   console.log(randomPosts);
//   expect(randomPosts).toEqual([]);
// });

//* test('random item from database', async () => {
//   const randomItem = await gossipFeedDAL.queryRandomPost('author_id2');
//   console.log(randomItem);
//   expect(randomItem).toMatchObject({});
// });

//* test('retrieve Ready Posts', async () => {
//   const posts = await gossipFeedService.readyPostsForFuture(
//     '617fc7e5e8bee9ff94617ab1',
//     10
//   );
//   expect(posts).toEqual([
//     '61826d52a723c22f51bfd333',
//     '61826d45a723c22f51bfd331',
//     '61826cfda723c22f51bfd32d',
//     '61821eb815a10999e48ac933',
//     '618371cd8909afdcf226c52f',
//     '618371c08909afdcf226c52d',
//     '618371bd8909afdcf226c52b',
//     '618371b98909afdcf226c529',
//     '61826d23a723c22f51bfd32f',
//     '618371ed8909afdcf226c533',
//   ]);
// });
