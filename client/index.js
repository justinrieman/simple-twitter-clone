const form = document.querySelector('.message-form');
const loader = document.querySelector('.loader');
const url = 'http://localhost:3000/tweets';

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
  });
});
