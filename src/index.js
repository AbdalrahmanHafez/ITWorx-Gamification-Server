const express = require("express");
var path = require("path");
var fs = require("fs"); //file system
var cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
var cors = require("cors");
require("dotenv").config();
const userAuth = require("./Middleware/userAuth");
const adminAuth = require("./Middleware/adminAuth");
const activityRoutes = require("./Routes/activity");
const employeeRoutes = require("./Routes/employee");
const badgeRoutes = require("./Routes/badge");
const departmentRoutes = require("./Routes/department");
const practiceRoutes = require("./Routes/practice");

const app = express();
app.use(
  cors({
    origin: process.env.React_Server_Origin,
    credentials: true,
    optionSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.cookie_HMAC_secret));
app.use(userAuth);

// Routes Setup
require("./Routes/authenticationRoutes")(app);
app.use("/activity", activityRoutes);
app.use("/employee", employeeRoutes);
app.use("/badge", badgeRoutes);
app.use("/department", departmentRoutes);
app.use("/practice", practiceRoutes);

const db = require("./Service/databaseService");

app.get("/", (req, res) => {
  // console.log(req.cookies);
  res.json({ message: "From the Node Server !" });
});

const handleDbError = (err) => {
  console.log(err);
};

const port = process.env.PORT || 8080;
db.on("error", handleDbError);

app.listen(port, () =>
  console.log(`server is listening at http://localhost:${port}`)
);
