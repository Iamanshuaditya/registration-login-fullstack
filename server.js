const express = require("express");
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/register", (req, res) => {
  const { name, email, password, repeatPass } = req.body;
  if (!name || !email || !password || !repeatPass || password !== repeatPass) {
    return res.status(400).json({ error: "Invalid input" });
  }

  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);

  const hashedPassword = bcrypt.hashSync(password, salt);

  const credentials = {
    id: Math.floor(Math.random() * 1000000),
    name,
    email,
    password: hashedPassword,
  };

  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Failed to read data:", err);
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
    const existingEmail = credentialsdata.find(
      (person) => person.email === email
    );
    if (existingEmail) {
      return res.status(400).json({
        error: "Email already exists",
      });
    }

    credentialsdata.push(credentials);
    fs.writeFile("data.json", JSON.stringify(credentialsdata), (err) => {
      if (err) {
        console.error("Unable to write data:", err);
        return res.status(500).send("Internal Server Error");
      }
      res.status(201).json(credentials);
    });
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;

  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Failed to read data:", err);
      return res.status(500).send("Internal Server Error");
    }

    const userData = JSON.parse(data);
    const user = userData.find((user) => user.email === email);

    if (user && bcrypt.compareSync(password, user.password)) {
      res.status(200).json({ message: "Logged in" });
      console.log("Logged in:", user.email);
    } else {
      res.status(401).json({ error: "Invalid credentials" });
      console.log("Invalid credentials for:", email);
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
