var express = require("express");
const db = require("../Service/databaseService");
const bodyParser = require("body-parser");
const moment = require("moment");

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.post("/AddNewCycle", (req, res) => {
  console.log(req.body);
});

router.post("/EditCycle", (req, res) => {
  console.log(req.body);
});

module.exports = router;
