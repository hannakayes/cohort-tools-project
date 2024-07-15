const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const PORT = 5005;
const mongoose = require("mongoose");

// DB connection

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// INITIALIZE EXPRESS APP
const app = express();

// MIDDLEWARE
app.use(
  cors({
    // Add the URLs of allowed origins to this array
    origin: ["http://localhost:5173"],
  })
);
app.use(cors()); // Enable CORS for all routes
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Cohort Tools API. Please visit /docs for the API documentation."
  );
});

app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});

app.get("/api/cohorts", (req, res) => {
  fs.readFile(path.join(__dirname, "cohorts.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load cohorts data" });
    }
    res.json(JSON.parse(data));
  });
});

app.get("/api/students", (req, res) => {
  fs.readFile(path.join(__dirname, "students.json"), "utf8", (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Failed to load students data" });
    }
    res.json(JSON.parse(data));
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
