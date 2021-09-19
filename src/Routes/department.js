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
router.get("/DepartmentRanking", (req, res) => {
  console.log(
    "sending Departments Ranking data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(`SELECT * FROM DepartmentRanking`, function (err, results, fields) {
    res.json(results);
  });
});

router.post("/EmployeeDepartments", (req, res) => {
  console.log(
    "sending employee departments data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `SELECT * FROM EmployeeWorkDepartment WHERE EmployeeWorkDepartment.employeeId = ${req.body.employeeId}`,
    function (err, results, fields) {
      res.json(results);
    }
  );
});
module.exports = router;
