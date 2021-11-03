// require('../../../db/mongoose');
const Users = require('../../../models/users');

const userSave = async () => {
  try {
    const user = new Users({
      name: 'swastik',
      email: 'swastikdragon@gmail.com',
      password: 'hello',
      profile_pic: {
        fileId: 'testing',
        url: 'testing',
        service: 'testing',
      },
      cover_pic: {
        fileId: 'testing',
        url: 'testing',
        service: 'testing',
      },
      tagline: 'testing',
      authorized: 'testing',
    });

    await user.save();
  } catch (err) {
    console.log(err);
  }
};

module.exports = userSave;
