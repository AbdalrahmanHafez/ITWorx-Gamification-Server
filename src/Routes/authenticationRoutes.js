const TokenGenerator = require("uuid-token-generator");
const tokgen = new TokenGenerator();
const moment = require("moment");
const db = require("../Service/databaseService");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const allowedLoggedTime = 60 * 60 * 1000;
const verifyUser = (email, password, isadminlogin) => {
  db.connect();
  const sqlQuery = isadminlogin
    ? "SELECT * FROM `Admin` WHERE email=? AND password=?"
    : "SELECT * FROM `Employee` WHERE isActive=true AND email=? AND password=?";
  return db
    .promise()
    .query(sqlQuery, [email, password])
    .then((res) => {
      dbresult = res[0];
      if (dbresult.length != 1) throw new Error("");
      if (email === dbresult[0].email && password === dbresult[0].password) {
        console.log("verified user isAdmin", isadminlogin);
        return dbresult[0];
      } else {
        throw new Error("");
      }
    });
};

function routes(app) {
  app.post("/login", function (req, res) {
    console.log("loggin user", req.body);
    const { email, password, isadminlogin } = req.body;

    verifyUser(email, password, isadminlogin)
      .then((user) => {
        //if user log in success, generate a JWT token for the user with a secret key
        const encodedData = { ...user, isAdmin: isadminlogin };
        jwt.sign(
          encodedData,
          process.env.cookie_HMAC_secret,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              console.log(err);
            }
            res.cookie("auth", token, {
              signed: true,
              maxAge: allowedLoggedTime,
            });

            res.status(200).send("OK");
          }
        );
      })
      .catch((err) => res.status(403).send("unathorized"));
  });

  app.post("/logout", (req, res) => {
    console.log("logging out", req.user.name);
    // console.log("cookie", req.signedCookies["auth"]);

    res.clearCookie("auth");
    res.status(200).send("OK");
  });
}

module.exports = routes;
