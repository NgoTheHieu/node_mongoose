const Review = require("../models/review");
const Book = require("../models/book");


exports.createReview = async function (req, res) {
  const { content } = req.body;

  try {
    const review = await Review.create({
      content: content,
      user: req.user._id,
      book: req.book._id
    })
    res.status(200).json({ status: 'ok', data: review })
  } catch (err) {
    res.status(500).json({ status: 'fail', error: err.message })
  }
}

exports.readReviews = async function (req, res) {
  try {
    const reviews = await Review.find({ book: req.book._id })
      .populate("user", "_id name")
      .populate({
        path: "book",
        select: "-createdAt -updatedAt -__v"
      })



    return res.status(200).json({ status: 'ok', data: reviews })
  } catch (err) {
    return res.status(500).json({ status: "fail", error: err.message })
  };
}
