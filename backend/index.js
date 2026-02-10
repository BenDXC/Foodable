const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const session = require("express-session");

const app = express();
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const PORT = 3001;
app.listen(PORT, () => {
  console.log("running server 3001.");
});

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "foodable",
});
db.connect((error) => {
  if (error) {
    console.log("MYSQL not Connected");
  } else {
    console.log("MYSQL Connected");
  }
});

app.post("/register", (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "INSERT INTO Foodable.donator(username, email, password) VALUES (?,?,?)",
    [username, email, password],
    (err, result) => {
      console.log(err);
    }
  );
});

app.post("/login", function (request, response) {
  // Capture the input fields
  let username = request.body.email;
  let password = request.body.password;
  if (username && password) {
    db.query(
      "SELECT * FROM Foodable.donator WHERE email = ? AND password = ?",
      [username, password],
      function (error, results, fields) {
        // If there is an issue with the query, output the error
        if (error) throw error;
        // If the account exists
        if (results.length > 0) {
          console.log("Correct User");
          response.status(200);
          // Authenticate the user
          request.session.loggedin = true;
          request.session.username = username;
          // Redirect to home page
          response.redirect("http://localhost:3000/");
        } else {
          response.send("Incorrect email and/or Password!");
        }
        response.end();
      }
    );
  } else {
    response.send("Please enter email and Password!");
    response.end();
  }
});

// http://localhost:3000/
app.get("/", function (request, response) {
  // If the user is loggedin
  if (request.session.loggedin) {
    // Output username
    response.send("Welcome back, " + request.session.username + "!");
  } else {
    // Not logged in
    response.send("Please login to view this page!");
  }
  response.end();
});
