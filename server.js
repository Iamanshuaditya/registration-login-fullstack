const { json } = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { emit } = require("process");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const credentials = {
    id: Math.floor(Math.random() * 1000000),
    name: req.body.name,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    repeatPass: req.body.repeatPass,
  };
  console.log(`Hashed Password: ${credentials.password}`);
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Failed in reading data");
      return res.status(500).send("Internal Server Error");
    }

    let credentialsdata;
    try {
      credentialsdata = JSON.parse(data);
    } catch (parseError) {
      credentialsdata = [];
    }

    if (!Array.isArray(credentialsdata)) {
      credentialsdata = [];
    }

    credentialsdata.push(credentials);
    fs.writeFile("data.json", JSON.stringify(credentialsdata), (err) => {
      if (err) {
        console.log("Unable to write data");
        return res.status(500).send("Internal Server Error");
      }
      res.status(201).json(credentials);
    });
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) throw err("Unable to read data");
    const userData = JSON.parse(data);
    const user = userData.find((user) => user.email === email);
    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).send("Logged in");
      console.log("logged in");
    } else {
      res.status(400).send("Invalid password");
      console.log("Invalid Password");
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
