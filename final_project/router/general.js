const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        }
        else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    let booksPromise = new Promise((resolve, reject) => {
        resolve(books)
    })

    booksPromise.then((data) => res.send(data))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    let isbnPromise = new Promise((resolve, reject) => {
        const isbn = req.params.isbn
        let selected_book = books[isbn]
        resolve(selected_book)
    })

    isbnPromise.then((data) => res.send(data));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    let authorPromise = new Promise((resolve, reject) => {
        const author = req.params.author
        let selected_author = []

        for (const book in books) {
            if (books[book].author == author) {
                selected_author.push(books[book])
            }
        }

        resolve(selected_author)
    })
    
    authorPromise.then((data) => res.send(data))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    let titlePromise = new Promise((resolve, reject) => {
        const title = req.params.title
        let selected_title = []

        for (const book in books) {
            if (books[book].title == title) {
                selected_title.push(books[book])
            }
        }

        resolve(selected_title)
    })

    titlePromise.then((data) => res.send(data))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn
    let selected_book = books[isbn].reviews
    res.send(selected_book)
});

module.exports.general = public_users;
