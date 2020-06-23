const express = require("express");
require("dotenv").config();
const app = express();

const mongoose = require("mongoose");
// mongodb://someuyser:somepassword@mongdbatlast.com/newDatabase
const bodyParser = require("body-parser");
const { readAuthor, createAuthor, updateAuthor, deleteAuthor } = require("./src/controllers/authorControllers");
const { createGenre, readGenres } = require("./src/controllers/genreControllers")
const { createBook } = require("./src/controllers/bookControllers");
const { createUser } = require("./src/controllers/userControllers");
const { login, auth } = require("./src/controllers/authControllers");
const {createReview, readReviews} = require("./src/controllers/reviewControllers");
const validateBook = require("./src/middlewares/checkBook");


mongoose.connect(process.env.DB_LOCAL, {
  // some options to deal with deprecated warning, you don't have to worry about them.
  useCreateIndex: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).then(() => console.log("Successfully connected to database")).catch(err => console.log(err))

const router = express.Router();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router)


router.get("/", (req, res) => {
  return res.status(200).json({ status: "ok", data: [] })
});

// POST create new author
router.route("/authors")
  .get(readAuthor)
  .post(createAuthor)

router.delete("/authors/:id", deleteAuthor);
router.put("/authors/:id", updateAuthor);

router.route("/genres")
  .post(createGenre)
  .get(readGenres)


router.route("/books/:bId/reviews")
  .get(auth, validateBook, readReviews)
  .post(auth, validateBook, createReview)
  .put(auth, validateBook )


router.route("/books")
.post(auth, createBook)

router.route("/users")
.post(createUser)



router.route("/auth/login")
.post(login)

app.listen(process.env.PORT, () => {
  console.log("App is running on port ", process.env.PORT);
});

// Add a new feature: Review on Books ( bookID, user, content )
// 1. create model + relationship
// 2. route + controller: 
// 2.a create a new review for a book => need user ID, book ID (make sure bookID is correct)
// 2.b write to our database => return book & review data 