const mongoose = require("mongoose");
const Genre = require("./genre");
const Author = require("./author");


const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "title is required"],
    trim: true
  },
  genres: Array,
  author: Object
},{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// create a temporary or virtual field
schema.virtual('reviews', {
  ref: 'Review', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'book', // is equal to `foreignField`
  // count: true
});

schema.pre('save', async function (next) {
  // this <<< is the class Schema
  this.author = await Author.findById(this.author);
  const genreArray = this.genres.map(async el => await Genre.findById(el))
  this.genres = await Promise.all(genreArray)
  next();
});

const Book = mongoose.model("Book", schema);



module.exports = Book;

