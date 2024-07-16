const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const PORT = 5005;
const mongoose = require("mongoose");
const Student = require('./models/Student.model')
const Cohort = require('./models/Cohort.model')

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

// DAY 1 & 2 ROUTES
app.get("/", (req, res) => {
  res.send(
    "Welcome to the Cohort Tools API. Please visit /docs for the API documentation."
  );
});

app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "docs.html"));
});


// DAY 3 ROUTES

app.get('/api/students', async (req, res) => {
  try {
    const studentsData = await Student.find()

    res.json(studentsData)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.get('/api/students/:studentId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.studentId)) {
      res.status(500).json('Invalid Id')
    } else {
      const studentData = await Student.findById(req.params.studentId)

      res.json(studentData)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.post('/api/students', async (req, res) => {
  try {
    const newStudent = await Student.create(req.body)

    res.status(201).json(newStudent)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.put('/api/students/:studentId', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.studentId, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(updatedStudent)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.delete('/api/students/:studentId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.studentId)) {
      res.status(500).json('Invalid Id')
    } else {
      await Student.findByIdAndDelete(req.params.studentId)

      res.status(204)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.get('/api/cohorts', async (req, res) => {
  try {
    const cohortsData = await Cohort.find()

    res.json(cohortsData)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.get('/api/cohorts/:cohortId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cohortId)) {
      res.status(500).json('Invalid Id')
    } else {
      const cohortData = await Cohort.findById(req.params.cohortId)

      res.json(cohortData)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.post('/api/cohorts', async (req, res) => {
  try {
    const newCohort = await Cohort.create(req.body)

    res.status(201).json(newCohort)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.put('/api/cohorts/:cohortId', async (req, res) => {
  try {
    const updatedCohort = await Cohort.findByIdAndUpdate(req.params.cohortId, req.body, {
      new: true,
      runValidators: true,
    })

    res.status(200).json(updatedCohort)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

app.delete('/api/cohorts/:cohortId', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.cohortId)) {
      res.status(500).json('Invalid Id')
    } else {
      await Cohort.findByIdAndDelete(req.params.cohortId)

      res.status(204)
    }
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
