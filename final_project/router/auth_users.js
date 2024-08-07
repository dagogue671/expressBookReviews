const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid

let userswithsamename = users.filter((user) => {
  return user.username === username;
});

if(userswithsamename.length > 0) {
  return true;
}
else{
  return false;
}

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if(validUsers.length > 0)
  {
    return true;
  }
  else{
    return false;
  }
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  console.log(`Username: ${username} Password: ${password}`);

  if(!username || !password)
  {
    return res.status(404).json({message: "Error logging in"});
  }

  if(authenticatedUser(username, password))
  {
    let accessToken = jwt.sign({
      data: password },
      'access', {expiresIn: 60 * 60});

      req.session.authorization = {
        accessToken, username
      }

      return res.status(200).send("User successfully logged in");
  }
  else{
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});



// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  let retrieveBook = books[isbn];

  if(retrieveBook)
  {
    let review = req.body.review;

    if(review)
    {
      retrieveBook.reviews = review;
    }

    books[isbn] = retrieveBook;

    return res.status(300).json(retrieveBook,null,4);
  }
  else{
    return res.status(400).send("Unable to find book");
  }


});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  if(isbn)
  {
    delete books[isbn];
  }

  return res.status(300).send(`Deleted ISBN ${isbn}`);
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
