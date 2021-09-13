const { v4: getuuid } = require("uuid");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const userAuth = (req, res, next) => {
  if (req.originalUrl == "/login") {
    next();
    return;
  }
  const authcookie = req.signedCookies["auth"];
  if (typeof authcookie !== "undefined") {
    const decodedData = jwt.verify(authcookie, process.env.cookie_HMAC_secret);
    // Putting the user data in the request object
    req.user = decodedData;
    //
    console.log("user auth ok", decodedData);
    next();
  } else {
    console.log("denied auth ok");
    res.status(403).send("unathorized");
  }

  // next();
};

module.exports = userAuth;
