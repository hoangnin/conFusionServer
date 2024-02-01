const express = require('express');
const Author = require('../models/author');
const authorRouter = express.Router();

authorRouter.route('/')
.get((req, res, next) => {
  Author.find({})
  .then((authors) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(authors);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  Author.create(req.body)
  .then((author) => {
    console.log('Author Created ', author);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(author);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /authors');
})
.delete((req, res, next) => {
  Author.delete({})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});
authorRouter.route('/:authorId')
.get((req, res, next) => {
  Author.findById(req.params.authorId)
  .then((author) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(author);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  Author.findByIdAndUpdate(req.params.authorId, {
    $set: req.body
  }, { new: true })
  .then((author) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(author);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
  Author.findByIdAndDelete(req.params.authorId)
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});
module.exports = authorRouter;