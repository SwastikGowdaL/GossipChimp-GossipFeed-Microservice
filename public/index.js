// eslint-disable-next-line no-undef
const socket = io();

if (localStorage.getItem('post1')) {
  console.log(localStorage.getItem('post1'));
} else {
  socket.emit('requestPost', {
    requestFor: 'posts',
    userID: '617fc7e5e8bee9ff94617ab1',
    count: 5,
  });
}

socket.on('posts', (posts) => {
  console.log(posts);
});
