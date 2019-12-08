const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

/* Handler function to wrap each route. */
function asyncHandler(cb){
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      res.status(500).send(error);
    }
  }
}

/* GET Shows the full list of books. */
router.get("/", asyncHandler(async (req, res) => {
  console.log("Shows the full list of books.");
  const books = await Book.findAll({ order: [["title", "ASC"]] });
  res.render("books/index", { books, title: "Books" });
}));

/* Shows the create new book form. */
router.get("/new", (req, res) => {
  //res.render("books/new-book", { book: Book.build(), title: "New Book" });
  res.render("books/new-book", { book: {}, title: "New Book" });
});

/* POST Posts a new book to the database. */
router.post('/new', asyncHandler(async (req, res) => {
  console.log("Posts a new book to the database.");
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", { book, errors: error.errors, title: "New Book" })
    } else {
      throw error;
    }  
  }
}));

/* GET Shows book detail form. */
router.get("/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if(book) {
    res.render("books/update-book", { book, title: 'Update Book' });  
  } else {
    res.render("page-not-found");
  }
})); 

/* Updates book info in the database. */
router.post("/:id", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/"); 
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    if(error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", { book, errors: error.errors, title: "Edit Book" })
    } else {
      throw error;
    }
  }
}));

/* Delete individual book. */
router.post("/:id/delete", asyncHandler(async (req ,res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/");
  } else {
    res.sendStatus(404);
  }
}));

module.exports = router;