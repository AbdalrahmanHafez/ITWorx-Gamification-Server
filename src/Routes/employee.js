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

router.get("/points", function (req, res) {
  const empid = req.user.id;
  // db.connect();
  const sqlQuery =
    "SELECT Employee.name, SUM(Activity.totalPoints) AS points FROM EmployeeSubActivity INNER JOIN Employee on Employee.id = EmployeeSubActivity.EmployeeId INNER JOIN Activity on Activity.id = EmployeeSubActivity.ActivityId WHERE EmployeeSubActivity.Done = 1 AND Employee.id = ?";

  return db
    .promise()
    .query(sqlQuery, [empid])
    .then((result) => {
      dbresult = result[0];
      if (dbresult.length != 1) throw new Error("");
      res.json(dbresult[0].points);
    });
});

router.get("/getPracticeName", function (req, res) {
  console.log("get prac name");
  const empid = req.user.id;
  // db.connect();
  const sqlQuery =
    "SELECT Employee.name, EmployeeWorkPractice.PracName As name FROM EmployeeWorkPractice INNER JOIN Employee on Employee.id = EmployeeWorkPractice.EmployeeId AND Employee.id = ?";

  return db
    .promise()
    .query(sqlQuery, [empid])
    .then((result) => {
      dbresult = result[0];
      if (dbresult.length != 1) throw new Error("");
      res.json(dbresult[0].name);
    })
    .catch((err) => console.log(err));
});

router.get("/getParticipatingEmployees", (req, res) => {
  console.log(
    "sending Participating Employees data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `Select E.name as EmployeeName, A.name as ActivityName, A.totalPoints as points, points as TotalPoints, B.Name as Badges, A.virtualRecognition
    From Activity A
    INNER Join EmployeeSubActivity ESA on ESA.ActivityId = A.id
    INNER Join Employee E on E.id = ESA.EmployeeId
    INNER Join EmployeeRanking ER on ER.id = E.id
    LEFT OUTER Join EmployeeGainBadge EGB on E.id = EGB.employeeId
    LEFT OUTER Join Badge B on B.id = EGB.badgeId
    Where ESA.Done=1
    GROUP BY E.name,  A.id
  `,
    function (err, results, fields) {
      res.json(results);
      console.log("participating employees", results);
    }
  );
});

// Define the about route
router.get("/about", function (req, res) {
  res.send("About us");
});

module.exports = router;
