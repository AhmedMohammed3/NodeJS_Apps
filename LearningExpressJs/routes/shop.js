const express = require("express");
const path = require("path");
const routeDir = require("../util/path");


const router = express.Router();

router.get("/", (req, res, next) => {
  res.sendFile(path.join(routeDir, "views", "shop.html"));
});

module.exports = router;
