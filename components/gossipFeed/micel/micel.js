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
