function errorHandler(err, req, res, next) {
  console.error("Error:", err.stack);
  res.status(500).send({ error: "Internal Server Error" });
}
function notFoundHandler(req, res, next) {
  res.status(404).send({ error: "Not Found" });
}

module.exports = { errorHandler, notFoundHandler };
