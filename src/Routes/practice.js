var express = require("express");
const db = require("../Service/databaseService");
const bodyParser = require("body-parser");

var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));
//Middle ware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log("Time: ", Date.now());
  next();
});

router.get("/PracticeRanking", (req, res) => {
  console.log(
    "sending Practice Rankings data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(`SELECT * FROM PracticeRanking`, function (err, results, fields) {
    res.json(results);
  });
});

module.exports = router;
