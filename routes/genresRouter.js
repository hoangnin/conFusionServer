const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Genres = require('../models/genre');
const authenticate = require('../authenticate');

const genresRouter = express.Router();

genresRouter.use(bodyParser.json());

genresRouter.route('/')
.get((req,res,next) => {
  Genres.find({})
  .then((genres) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(genres);
  }, (err) => next(err))
  .catch((err) => next(err));
})

.post(authenticate.verifyUser, (req, res, next) => {
  Genres.create(req.body)
    .then((genre) => {
      console.log('Genre Created ', genre);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({
        success: true,
        count: Array.isArray(genre) ? genre.length : 1,
        genre: genre
      });
    })
    .catch((err) => next(err));
})

.put(authenticate.verifyUser,(req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /genres');
})

.delete(authenticate.verifyUser,(req, res, next) => {
  Genres.remove({})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));    
});

genresRouter.route('/:genreId')
.get((req,res,next) => {
    Genres.findById(req.params.genreId)
    .then((genre) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(genre);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(authenticate.verifyUser,(req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /genres/'+ req.params.genreId);
})

.put(authenticate.verifyUser,(req, res, next) => {
    Genres.findByIdAndUpdate(req.params.genreId, {
        $set: req.body
    }, { new: true })
    .then((genre) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(genre);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.delete(authenticate.verifyUser,(req, res, next) => {
    Genres.findByIdAndDelete(req.params.genreId)
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({
            isDelete: true,
            genreDeleted: resp
        });
    }, (err) => next(err))
    .catch((err) => next(err));
});


module.exports = genresRouter;