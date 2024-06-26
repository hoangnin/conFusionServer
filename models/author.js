const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  birthYear: { type: Number },
  country: { type: String }
});

module.exports = mongoose.model('Author', authorSchema);