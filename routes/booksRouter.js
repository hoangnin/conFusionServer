const express = require('express');
const Book = require('../models/book');
const bookRouter = express.Router();

bookRouter.route('/')
.get((req, res, next) => {
  Book.find({})
  .then((books) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(books);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  Book.create(req.body)
  .then((book) => {
    console.log('Book Created ', book);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(book);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  res.statusCode = 403;
  res.end('PUT operation not supported on /books');
})
.delete((req, res, next) => {
  Book.deleteMany({})
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});
bookRouter.route('/:bookId')
.get((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(book);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  Book.findByIdAndUpdate(req.params.bookId, {
    $set: req.body
  }, { new: true })
  .then((book) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(book);
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
  Book.findByIdAndDelete(req.params.bookId)
  .then((resp) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(resp);
  }, (err) => next(err))
  .catch((err) => next(err));
});


bookRouter.route('/:bookId/comments')
.get((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    if (book != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(book.comments);
    } else {
      err = new Error('Book ' + req.params.bookId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.post((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    if (book != null) {
      book.comments.push(req.body);
      book.save()
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      }, (err) => next(err));
    } else {
      err = new Error('Book ' + req.params.bookId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    if (book != null) {
      for (var i = (book.comments.length - 1); i >= 0; i--) {
        
        
        book.comments.pull(book.comments[i]._id);
      }
      book.save()
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      }, (err) => next(err));
    } else {
      err = new Error('Book ' + req.params.bookId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
});

bookRouter.route('/:bookId/comments/:commentId')
.get((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    if (book != null && book.comments.id(req.params.commentId) != null) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json(book.comments.id(req.params.commentId));
    } else if (book == null) {
      err = new Error('Book ' + req.params.bookId + ' not found');
      err.status = 404;
      return next(err);
    } else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.put((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    if (book != null && book.comments.id(req.params.commentId) != null) {
      
      if (req.body.comment) {
        console.log(req.body.comment);
        book.comments.id(req.params.commentId).comment = req.body.comment;
        
      }
      book.save()
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      }, (err) => next(err));
    } else if (book == null) {
      err = new Error('Book ' + req.params.bookId + ' not found');
      err.status = 404;
      return next(err);
    } else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
})
.delete((req, res, next) => {
  Book.findById(req.params.bookId)
  .then((book) => {
    if (book != null && book.comments.id(req.params.commentId) != null) {
      book.comments.pull(req.params.commentId);
      book.save()
      .then((book) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(book);
      }, (err) => next(err));
    } else if (book == null) {
      err = new Error('Book ' + req.params.bookId + ' not found');
      err.status = 404;
      return next(err);
    } else {
      err = new Error('Comment ' + req.params.commentId + ' not found');
      err.status = 404;
      return next(err);
    }
  }, (err) => next(err))
  .catch((err) => next(err));
});

module.exports = bookRouter;