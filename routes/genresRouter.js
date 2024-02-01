const express = require('express');
const Genre = require('../models/genre');
const genreRouter = express.Router();

genreRouter.route('/')
.get((req, res, next) => {
  Genre.find({})
  .then((genres) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(genres);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  Genre.create(req.body)
  .then((genre) => {
    console.log('Genre Created ', genre);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(genre);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /genres');
})
.delete((req, res, next) => {
  Genre.delete({})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});
genreRouter.route('/:genresId')
.get((req, res, next) => {
  Genre.findById(req.params.genresId)
  .then((genre) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(genre);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  Genre.findByIdAndUpdate(req.params.genresId, {
    $set: req.body
  }, { new: true })
  .then((genre) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(genre);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
  Genre.findByIdAndDelete(req.params.genresId)
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});
module.exports = genreRouter;