const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  //console.log(`Username: ${username} Password: ${password}` )

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(books, null, 4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

  let retrieveBooks = books[isbn];

  return res.status(300).json(retrieveBooks, null, 4);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;

  if(author.length > 0)
  {
    let retrieveBooks = Object.values(books).filter(book => book.author === author);

    return res.status(300).json(retrieveBooks, null, 4);
  }
  else{
    return res.status(400).send("Bad request");
  }


})


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  if(title.length > 0)
  {
    let retrieveTitle = Object.values(books).filter(book => book.title === title);

    return res.status(300).json(retrieveTitle, null, 4);
  }
  else
  {
    return res.status(400).send("Bad request");
  }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;


  return res.status(300).json(books[isbn].review, null, 4);
});

module.exports.general = public_users;
