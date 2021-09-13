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

  console.log("employee subscibed to ", actid, "emp id", empid);

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

// Define the about route
router.get("/about", function (req, res) {
  res.send("About us");
});

module.exports = router;
