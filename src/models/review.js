const mongoose = require("mongoose");


const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: [true, "review needs a content"],
    minLength: 10
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: "Book",
    required: true
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})





const Review = mongoose.model("Review", schema);

module.exports = Review