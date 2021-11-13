// eslint-disable-next-line no-undef
const socket = io();
const displayPosts = document.getElementById('posts');

if (localStorage.getItem('post1')) {
  console.log(localStorage.getItem('post1'));
} else {
  socket.emit('requestPost', {
    requestFor: 'posts',
    userID: '617fc7e5e8bee9ff94617ab1',
    count: 30,
  });
}

socket.on('posts', (posts) => {
  console.log(posts);
  for (const post of posts) {
    const p = document.createElement('p');
    p.innerText = post;
    p.style.border = '1px solid black';
    displayPosts.appendChild(p);
  }
});
