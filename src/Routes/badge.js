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

router.post("/EditBadge", function (req, res) {
  const bid = req.body.id;
  const adid = req.user.id;
  console.log("Badge id", 1);
  console.log("----------------------");
  console.log("admin id", adid);
  const { name, description, isDeveloper, pointsNeeded, Active } = req.body;
  console.log(
    "Saving Your Badge data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    "UPDATE Badge B SET B.name = ?, B.description = ?, B.isDeveloper = ?, B.pointsNeeded = ?, B.Active = ?  WHERE B.id = ? AND B.AdminId = ?",
    [name, description, isDeveloper, pointsNeeded, Active, 1, adid],
    function (err, results, fields) {
      console.log("Your Badges Edited result", results);
      res.json(results);
    }
  );
});
router.post("/CreateBadge", (req, res) => {
  const adid = req.user.id;
  let { name, desc, type, points, disabled } = req.body;
  console.log("Creating badge");
  console.log("Admin id ", adid);
  console.log(
    "Saving Your Badge data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  if (!disabled) disabled = 0;
  disabled = !disabled;

  db.query(
    "INSERT INTO `Badge` ( `Name`, `Description`, `isDeveloper`, `PointsNeeded`, `Active`, `AdminId`) VALUES ( ?, ?, ?, ?, ?,? )",
    [name, desc, type, points, disabled, adid],
    function (err, results, fields) {
      console.log("Your Badges result", results);
      res.json(results);
    }
  );
});

router.post("/EmployeeGainedBadges", (req, res) => {
  console.log(
    "sending employee Gained Badges data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `SELECT * FROM EmployeeGainBadge INNER JOIN Badge WHERE EmployeeGainBadge.employeeId = ${req.body.employeeId}`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});

module.exports = router;
