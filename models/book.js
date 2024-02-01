const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
 comment: { type: String },
});

const bookSchema = new Schema({
  isbn: { type: String, required: true },
  title: { type: String, required: true },
  subTitle: { type: String },
  publish_date: { type: Date },
  publisher: { type: String },
  pages: { type: Number },
  description: { type: String },
  website: { type: String },
  comments: [commentSchema]
});

module.exports = mongoose.model('Book', bookSchema);