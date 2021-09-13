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
      if (err) console.log("specific err", err);
      console.log(result);
      dbresult = result[0];
      console.log(dbresult.length);
      if (dbresult.length != 1) throw new Error("");
      res.json(dbresult[0]);
    })
    .catch((err) => {
      console.log("err", err);
    });
});

// Define the about route
router.get("/about", function (req, res) {
  res.send("About us");
});

module.exports = router;
