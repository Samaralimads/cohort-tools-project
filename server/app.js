const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// MIDDLEWARE
app.use(cors({ origin: ["http://localhost:5173"] }));
// ...
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//returns all cohorts
app.get("/api/cohorts", (req, res) => {
  Cohort.find({})
    .then((cohorts) => {
      console.log("Cohorts:", cohorts);
      res.json(cohorts);
    })
    .catch((error) => {
      res.status(500).send({ error: "Failed to retrieve cohorts" });
    });
});

//returns the specified cohort by id
app.get("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const oneCohort = await Cohort.findById(cohortId);
    res.status(200).json(oneCohort);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve one cohort" });
  }
});

//creates a new cohort
app.post("/api/cohorts", async (req, res, next) => {
  try {
    const inProgress = req.body.inProgress;
    const cohortSlug = req.body.cohortSlug;
    const cohortName = req.body.cohortName;
    const program = req.body.program;
    const campus = req.body.campus;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const programManager = req.body.programManager;
    const leadTeacher = req.body.leadTeacher;
    const totalHours = req.body.totalHours;

    const cohortToAdd = {
      inProgress,
      cohortSlug,
      cohortName,
      program,
      campus,
      startDate,
      endDate,
      programManager,
      leadTeacher,
      totalHours,
    };
    await Cohort.create(cohortToAdd);
    res.status(201).json({
      message: "Success - Cohort created",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cannot create cohort", error: error.message });
  }
});

//updates the specified cohort by Id
app.put("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const updatedCohort = await Cohort.findByIdAndUpdate(cohortId, req.body, {
      new: true,
    });
    res.status(200).json(updatedCohort);
  } catch (error) {
    res.status(500).json({
      message: "Error while updating a single cohort",
      error: error.message,
    });
  }
});

//deletes the specified cohort by Id
app.delete("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    await Cohort.findByIdAndDelete(cohortId);
    res.sendStatus(204);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Cannot delete this cohort", error: error.message });
  }
});

//returns all students
app.get("/api/students", (req, res) => {
  Student.find({})
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      res.status(500).send({ error: "Failed to retrieve students" });
    });
});

//returns all the students of a specified cohort
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const studentsByCohort = await Student.find({
      cohort: req.params.cohortId,
    });
    res.status(200).json(studentsByCohort);
  } catch (error) {
    res.status(500).json({
      message: "Cannot get the students of this cohort",
      error: error.message,
    });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
