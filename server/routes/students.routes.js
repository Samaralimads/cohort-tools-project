const router = require("express").Router();
const Student = require("../models/Student.model");

//all routes are prefixed with /api/students/

//returns all students and their respective cohorts
router.get("/", (req, res) => {
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
router.get("/cohort/:cohortId", async (req, res, next) => {
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
router.get("/:studentId", async (req, res, next) => {
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
router.post("/", async (req, res) => {
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
router.put("/:studentId", async (req, res, next) => {
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
router.delete("/:studentId", async (req, res, next) => {
  try {
    await Student.findByIdAndDelete(req.params.studentId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
