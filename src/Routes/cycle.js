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

router.get("/getCurrent", (req, res) => {
  console.log(
    "sending current Cycle",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  const SQL_Query =
    "SELECT * FROM Cycle WHERE Cycle.startDate <= curdate() and Cycle.endDate >= curdate();";

  db.query(SQL_Query, function (err, results, fields) {
    res.json(results);
  });
});

router.post("/editCurrent", (req, res) => {
  console.log("editing current Cycle");

  let { id, name, startDate, endDate } = req.body;

  db.query(
    "UPDATE Cycle C SET C.name = ?, C.startDate = ?, C.endDate = ? WHERE C.id = ?",
    [name, startDate, endDate, id],
    function (err, results, fields) {
      console.log(results);
      res.json(results);
    }
  );
});

module.exports = router;
