function notFoundHandler(req, res, next) {
  res.status(404).send({ error: "Not Found" });
}

function errorHandler(err, req, res, next) {
  console.error("Error:", err.stack);
  res.status(500).send({ error: "Internal Server Error" });
}

module.exports = { notFoundHandler, errorHandler };
