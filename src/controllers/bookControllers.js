const Book = require("../models/book");


exports.createBook = async function (req, res) {
  const { title, genres, author } = req.body;

  const book = new Book({
    title: title,
    genres: genres,
    author: author
  });

  await book.save()

  return res.json({ status: "ok", data: book })
}

