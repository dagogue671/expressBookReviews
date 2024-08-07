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
public_users.get('/', async function (req, res) {
  //Write your code here
  const getBooks = new Promise((resolve, rejected) => {

    let success = books != null ? true : false;
    
    if(success)
    {
      resolve(res.status(300).json(books, null, 4));
    }
    else{
      rejected(res.status(400).send("Book List Empty"));
    }
  });

  getBooks.then(() => console.log("Get Books Promise Resolved"))
    .catch(() => console.log("Unable to Get Book list"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const getBooksbyISBN = new Promise((resolve, rejected) => {
    const isbn = req.params.isbn;
    let retrieveBooks = books[isbn];
   
    let success = retrieveBooks != null ? true : false;

    if(success)
    {
      resolve(res.status(300).json(retrieveBooks, null, 4));
    }
    else
    {
      rejected(res.status(400).send("Unable to find book by ISBN"));
    }
    
  });

  getBooksbyISBN
    .then(() => console.log("Found Book by ISBN"))
    .catch(() => console.log("Unable to find book by ISBN"));

  
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here

  let getBooksByAuthor = new Promise((resolved, rejected) =>{

    const author = req.params.author;
    let retrieveBooks = [];

    if(author.length > 0)
    {
      retrieveBooks = Object.values(books).filter(book => book.author === author);
    }
    else{
      retrieveBooks = null;
    }

    let success = retrieveBooks.length > 0 ? true : false;

    if(success)
      {
       resolved(res.status(300).json(retrieveBooks, null, 4));
      }
      else{
       rejected(res.status(400).send("Bad request"));
     }
   
  });
 
  getBooksByAuthor
    .then(() => console.log("Found Books by Author"))
    .catch(() => console.log("Unable to find Book(s) by Author"));

});


// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const retrieveBooksByTitle = new Promise((resolved, rejected) => {
  
  const title = req.params.title;
  let retrieveTitle = [];

  if(title.length > 0)
  {
    retrieveTitle = Object.values(books).filter(book => book.title === title);
  }
  else
  {
    retrieveTitle = null;
  }

  let success = retrieveTitle.length > 0 ? true : false;

  if(success)
  {
    resolved(res.status(300).json(retrieveTitle, null, 4));
  }
  else
  {
    rejected(res.status(400).send("Bad Request"));
  }
  })

  retrieveBooksByTitle
    .then(() => console.log("Retrived Books by Title"))
    .catch(() => console.log("Unable to find Book(s) by Title"));

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;


  return res.status(300).json(books[isbn].review, null, 4);
});

module.exports.general = public_users;
