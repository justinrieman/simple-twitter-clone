const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const moment = require('moment');
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

app.get('/tweets', (req, res) => {
  Post.find()
    .exec()
    .then((docs) => {
      const response = docs.map((doc) => {
        return {
          name: doc.name,
          message: doc.message,
          createdAt: moment(doc.createdAt).fromNow(),
        };
      });
      res.status(200).json(response);
    });
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
      name: req.body.name.toString(),
      message: req.body.message.toString(),
      createdAt: new Date().toISOString(),
    });

    post
      .save()
      .then((result) => {
        console.log(result.name);
        res.status(200).json({
          message: 'Post added successfully!',
          tweet: {
            post,
          },
        });
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
