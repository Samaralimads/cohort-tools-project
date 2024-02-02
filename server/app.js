const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");
const helmet = require("helmet");
const {
  errorHandler,
  notFoundHandler,
} = require("./middleware/error-handling");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to MongoDB", err));

// MIDDLEWARE
app.use(helmet());
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...

//
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//COHORT ROUTES
//returns all cohorts
app.get("/api/cohorts", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find({});
    console.log("Cohorts:", cohorts);
    res.json(cohorts);
  } catch (error) {
    next(error);
  }
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
    next(error);
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
    next(error);
  }
});

//deletes the specified cohort by Id
app.delete("/api/cohorts/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    await Cohort.findByIdAndDelete(cohortId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

//STUDENT ROUTES
//returns all students and their respective cohorts
app.get("/api/students", (req, res) => {
  Student.find({})
    .populate("cohort")
    .then((students) => {
      res.json(students);
    })
    .catch((error) => {
      next(error);
    });
});

//returns all the students of a specified cohort
app.get("/api/students/cohort/:cohortId", async (req, res, next) => {
  try {
    const studentsByCohort = await Student.find({
      cohort: req.params.cohortId,
    }).populate("cohort");
    res.status(200).json(studentsByCohort);
  } catch (error) {
    next(error);
  }
});

//returns the specified student by id
app.get("/api/students/:studentId", async (req, res, next) => {
  try {
    const oneStudent = await Student.findById(req.params.studentId).populate(
      "cohort"
    );

    res.status(200).json(oneStudent);
  } catch (error) {
    next(error);
  }
});

//Creates a new student with their respective cohort id
app.post("/api/students", async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      linkedinUrl,
      languages,
      program,
      background,
      image,
      cohortId,
    } = req.body;

    const newStudent = new Student({
      firstName,
      lastName,
      email,
      phone,
      linkedinUrl,
      languages,
      program,
      background,
      image,
      cohort: cohortId,
    });
    await Student.create(newStudent);
    res.status(201).json({
      message: "Success - Student created",
    });
  } catch (error) {
    next(error);
  }
});

//Updates the specified student by id
app.put("/api/students/:studentId", async (req, res, next) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.studentId,
      req.body,
      {
        new: true,
      }
    );
    res.status(200).json(updatedStudent);
  } catch (error) {
    next(error);
  }
});

//Deletes the specified student by id
app.delete("/api/students/:studentId", async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);
app.use(notFoundHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
