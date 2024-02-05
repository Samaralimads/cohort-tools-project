const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require("bcryptjs");
const salt = 12;
const jwt = require("jsonwebtoken");
const isAuthenticated = require("../middleware/isAuthenticated");

// POST  /auth/signup
// ...
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please input all the required fields." });
    }
    const userAlreadyExist = await User.findOne({ email: email });

    if (userAlreadyExist) {
      return res.status(400).json({ message: "This email is already in use." });
    }
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log(createdUser);
    return res.status(201).json({ message: "User created" });
  } catch (error) {
    next(error);
  }
});

// POST  /auth/login
// ...

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please input all the required fields." });
    }
    const existingUser = await User.findOne({ email }).select(
      "password name email"
    );
    console.log(existingUser);
    if (!existingUser) {
      return res.status(400).json({ message: "Wrong credentials" });
    }
    const matchingPassword = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!matchingPassword) {
      return res.status(400).json({ message: "Wrong credentials" });
    }
    /**
     * We can login the user
     */
    const token = jwt.sign(
      { _id: existingUser._id },
      process.env.TOKEN_SECRET,
      {
        algorithm: "HS256",
        expiresIn: "7d",
      }
    );
    res.json({ authToken: token });
  } catch (error) {
    next(error);
  }
});

// GET  /auth/verify
// ...

router.get("/verify", isAuthenticated, (req, res) => {
  res.json(req.user);
});

module.exports = router;
