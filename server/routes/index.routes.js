const router = require("express").Router();
const Cohort = require("../models/Cohort.model.js");
const Student = require("../models/Student.model.js");

// all routes are prefixed with /api

router.use("/auth", require("./auth.routes"));

router.use("/cohorts", require("./cohorts.routes.js"));

router.use("/students", require("./students.routes"));

module.exports = router;
