const router = require("express").Router();
const Cohort = require("../models/Cohort.model.js");

//all routes are prefixed with /api/cophorts/

router.get("/", async (req, res, next) => {
  try {
    const cohorts = await Cohort.find({});
    console.log("Cohorts:", cohorts);
    res.json(cohorts);
  } catch (error) {
    next(error);
  }
});

//returns the specified cohort by id

router.get("/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    const oneCohort = await Cohort.findById(cohortId);
    res.status(200).json(oneCohort);
  } catch (error) {
    res.status(500).send({ error: "Failed to retrieve one cohort" });
  }
});

//creates a new cohort
router.post("/", async (req, res, next) => {
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
router.put("/:cohortId", async (req, res, next) => {
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
router.delete("/:cohortId", async (req, res, next) => {
  try {
    const { cohortId } = req.params;
    await Cohort.findByIdAndDelete(cohortId);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
