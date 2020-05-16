const form = document.querySelector('.message-form');
const loader = document.querySelector('.loader');
const url = 'http://localhost:3000/tweets';
const tweetSection = document.querySelector('.tweet-section');

getAllTweets();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = e.target.name.value;
  const message = e.target.message.value;

  const data = {
    name,
    message,
  };

  form.style.display = 'none';
  loader.style.display = 'block';

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((result) => {
      form.reset();
      form.style.display = 'block';
      getAllTweets();
    });
});

function getAllTweets() {
  tweetSection.innerHTML = '';
  fetch(url)
    .then((response) => response.json())
    .then((tweets) => {
      tweets.reverse();
      tweets.forEach((tweet) => {
        createTweet(tweet);
      });
    });
  loader.style.display = 'none';
}

function createTweet(tweet) {
  const tweetContainer = document.createElement('div');
  tweetContainer.classList.add('tweet-container');
  const tweetHeader = document.createElement('div');
  tweetHeader.classList.add('tweet-header');
  const tweetName = document.createElement('p');
  tweetName.classList.add('tweet-name');
  tweetName.textContent = tweet.name;
  const tweetTime = document.createElement('p');
  tweetTime.classList.add('tweet-time');
  tweetTime.textContent = tweet.createdAt;
  const tweetMessage = document.createElement('p');
  tweetMessage.classList.add('tweet-message');
  tweetMessage.textContent = tweet.message;

  tweetHeader.appendChild(tweetName);
  tweetHeader.appendChild(tweetTime);
  tweetContainer.appendChild(tweetHeader);
  tweetContainer.appendChild(tweetMessage);
  tweetSection.appendChild(tweetContainer);
}
