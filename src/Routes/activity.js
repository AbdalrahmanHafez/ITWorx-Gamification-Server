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

router.get("/getInfoAll", function (req, res) {
  console.log("getting all the activities");

  const empid = req.user.id;
  const sqlQuery = "SELECT * FROM Activity WHERE Activity.active = true";

  return db
    .promise()
    .query(sqlQuery, [empid])
    .then((result) => {
      dbresult = result[0];
      res.json(dbresult);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/getInfo", function (req, res) {
  const actid = req.body.id;

  // db.connect();
  const sqlQuery =
    "SELECT * FROM Activity WHERE Activity.id = ? AND Activity.active = true";

  return db
    .promise()
    .query(sqlQuery, [actid])
    .then((result) => {
      dbresult = result[0];
      console.log(dbresult);
      if (dbresult.length != 1) throw new Error("");
      res.json(dbresult[0]);
    })
    .catch((err) => {
      console.log("err", err);
    });
});

router.post("/subscribe", function (req, res) {
  const actid = req.body.id;
  const empid = req.user.id;

  const currentDate = moment().format("YYYY-MM-DD");

  // const currentDate = new Date().toLocaleDateString("en-US", {
  //   timeZone: "Egypt",
  // });

  console.log("employee subscribed to ", actid, "emp id", empid);

  const sqlQuery =
    "INSERT INTO `EmployeeSubActivity` (`EmployeeId`, `ActivityId`, `startDate`, `Done`) VALUES (?, ?, ?, 0)";

  return db
    .promise()
    .query(sqlQuery, [empid, actid, currentDate])
    .then((result) => {
      dbresult = result[0];
      console.log(dbresult);

      res.status(200).send("ok");
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/unsubscribe", function (req, res) {
  const actid = req.body.id;
  const empid = req.user.id;

  console.log("employee un subscibed from ", actid, "emp id", empid);

  const sqlQuery =
    "DELETE FROM EmployeeSubActivity WHERE EmployeeId = ? AND ActivityId = ?";

  return db
    .promise()
    .query(sqlQuery, [empid, actid])
    .then((result) => {
      dbresult = result[0];
      console.log(dbresult);

      res.status(200).send("ok");
    })
    .catch((err) => {
      res.status(400).send("failed to unsubscirbe");
      console.log(err);
    });
});

router.post("/querySubscibed", function (req, res) {
  const actid = req.body.id;
  const empid = req.user.id;

  const currentDate = moment().format("YYYY-MM-DD");

  // const currentDate = new Date().toLocaleDateString("en-US", {
  //   timeZone: "Egypt",
  // });

  console.log("is employee subscibed to ", actid, "emp id", empid);

  const sqlQuery =
    "SELECT * FROM EmployeeSubActivity WHERE EmployeeId = ? AND ActivityId = ?";

  return db
    .promise()
    .query(sqlQuery, [empid, actid, currentDate])
    .then((result) => {
      dbresult = result[0];
      console.log(dbresult);
      if (dbresult.length != 0) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getNeedsReview", function (req, res) {
  // TODO: admin auth middleware

  const currentDate = moment().format("YYYY-MM-DD");

  console.log("sending review Acitvites");

  const sqlQuery =
    "SELECT Activity.id as actId, Activity.name as actName, Activity.description as actDesc , Employee.id as empId, Employee.name as empName, EmployeeSubActivity.Done as done  FROM Employee INNER JOIN EmployeeSubActivity on Employee.id = EmployeeSubActivity.EmployeeId INNER JOIN Activity on Activity.id = EmployeeSubActivity.ActivityId INNER JOIN Cycle on Cycle.id = Activity.cycleId WHERE Cycle.startDate <= curdate() and Cycle.endDate >= curdate() AND Activity.active = 1 AND EmployeeSubActivity.Done is Null";

  return db
    .promise()
    .query(sqlQuery)
    .then((result) => {
      let dbresult = result[0];
      const formated = dbresult.map((obj, i) => {
        return {
          activity: {
            id: obj.actId,
            name: obj.actName,
            desc: obj.actDesc,
            done: obj.done,
          },
          employee: {
            id: obj.empId,
            name: obj.empName,
          },
        };
      });
      console.log("formated 1", formated);

      res.status(200).send(formated);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/getNew", (req, res) => {
  const currentDate = new Date().toLocaleTimeString("en-US", {
    timeZone: "Egypt",
  });
  console.log("sending New Activities", currentDate);
  db.query(
    "SELECT * FROM Activity WHERE startDate > DATE_ADD(CURDATE(), INTERVAL -3 DAY)",
    function (err, results, fields) {
      console.log("new Acttivites result", results);
      res.json(results);
    }
  );
});

router.post("/getYours", (req, res) => {
  console.log(
    "sending Your activities data",
    new Date().toLocaleTimeString("en-US", { timeZone: "Egypt" })
  );
  db.query(
    `SELECT * FROM Activity inner join EmployeeSubActivity on Activity.id = EmployeeSubActivity.ActivityId WHERE EmployeeSubActivity.EmployeeId = ${req.body.employeeId}`,
    function (err, results, fields) {
      console.log("Your Acttivites result", results);
      res.json(results);
    }
  );
});

router.get("/getDoneReview", function (req, res) {
  // TODO: admin auth middleware

  const currentDate = moment().format("YYYY-MM-DD");

  console.log("sending review Acitvites");

  const sqlQuery =
    "SELECT Activity.id as actId, Activity.name as actName, Activity.description as actDesc , Employee.id as empId, Employee.name as empName, EmployeeSubActivity.Done as done FROM Employee INNER JOIN EmployeeSubActivity on Employee.id = EmployeeSubActivity.EmployeeId INNER JOIN Activity on Activity.id = EmployeeSubActivity.ActivityId INNER JOIN Cycle on Cycle.id = Activity.cycleId WHERE Cycle.startDate <= curdate() and Cycle.endDate >= curdate() AND Activity.active = 1 AND EmployeeSubActivity.Done is Not Null";

  return db
    .promise()
    .query(sqlQuery)
    .then((result) => {
      let dbresult = result[0];
      const formated = dbresult.map((obj, i) => {
        return {
          activity: {
            id: obj.actId,
            name: obj.actName,
            desc: obj.actDesc,
            done: obj.done,
          },
          employee: {
            id: obj.empId,
            name: obj.empName,
          },
        };
      });
      console.log("formated 2", formated);

      res.status(200).send(formated);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/AddActivity", (req, res) => {
  console.log(req.body);
  //
  // db.query(
  //   "SELECT * FROM Activity inner join EmployeeSubActivity on Activity.id = EmployeeSubActivity.ActivityId",
  //   function (err, results, fields) {
  //     res.json(results);
  //   }
  // );
});

router.post("/setAcception", function (req, res) {
  let { actId, empId, eventType } = req.body;

  console.log("setAcception", "emp id", empId, "act ID", actId);

  const doneVal = eventType === "accept" ? 1 : 0;

  const sqlQuery =
    "UPDATE EmployeeSubActivity SET EmployeeSubActivity.Done = ? WHERE EmployeeSubActivity.EmployeeId = ? AND EmployeeSubActivity.ActivityId = ?";

  return db
    .promise()
    .query(sqlQuery, [doneVal, empId, actId])
    .then((result) => {
      dbresult = result[0];
      console.log(dbresult);
      res.status(200).send("OK");
    })
    .catch((err) => {
      console.log(err);
    });
});
module.exports = router;
