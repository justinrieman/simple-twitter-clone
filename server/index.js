const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

mongoose.connect(
  'mongodb+srv://justin:' +
    process.env.MONGO_PW +
    '@cluster0-b4glf.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  message: String,
  createdAt: String,
});

const Post = mongoose.model('Post', postSchema);

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello! :)' });
});

function isValid(tweet) {
  return (
    tweet.name &&
    tweet.name.toString().trim() !== '' &&
    tweet.message &&
    tweet.message.toString().trim() !== ''
  );
}

app.post('/tweets', (req, res) => {
  if (isValid(req.body)) {
    // Enter into database

    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      message: req.body.message,
      createdAt: new Date().toISOString(),
    });

    post
      .save()
      .then((result) => {
        res.status(200).json({ message: 'Post added successfully!' });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
    return res
      .status(422)
      .json({ error: 'Invalid post. Must contain a name and message' });
  }
});

app.listen(3000, () => {
  console.log('Listening on port 3000');
});
