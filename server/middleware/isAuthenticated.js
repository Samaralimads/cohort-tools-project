const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

async function isAuthenticated(req, res, next) {
  try {
    console.log(req.headers);
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return res.status(400).json({ message: "No authorization found" });
    }
    // console.log(authorizationHeader)
    const token = authorizationHeader.replace("Bearer ", "");
    // console.log(token)
    const payload = jwt.verify(token, process.env.TOKEN_SECRET, {
      algorithms: ["HS256"],
    });
    console.log(payload);
    const user = await User.findById(payload._id);
    if (!user) {
      return res.status(401).json({ message: "Denied!" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}
module.exports = isAuthenticated;
