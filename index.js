const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/User");
const passport = require("passport");

//use view engine ejs
app.set("views", __dirname + "views");
app.set("view engine", "ejs");

// middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//use express-session
app.use(
  require("express-session")({
    secret: process.env.COOKIE_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
  })
);
//Use passport Middlaware
app.use(passport.initialize());
app.use(passport.session());
//Require passport strategy
require("./config/passport")(passport);

//routes
const userApiRoutes = require("./routes/api/user");
app.use("/api/user", userApiRoutes);

const userRoutes = require("./routes/user");
app.use("/", userRoutes);

//mongo config
const PORT = process.env.PORT || 3000;
const UserDB = process.env.DB_USERNAME || "root";
const PasswordDB = process.env.DB_PASSWORD || "password";
const NameDB = process.env.DB_NAME || "books";
const HostDb = process.env.DB_HOST || "mongodb://localhost:27017/";

//user for example
const newUser = new User({
  username: "user",
  password: "pass",
  email: "ex@ex.ex",
  name: "Name",
});

async function start() {
  try {
    await mongoose.connect(HostDb, {
      user: UserDB,
      pass: PasswordDB,
      dbName: NameDB,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    await newUser.save();
    app.listen(PORT, () => {
      console.log(`=== start server PORT ${PORT} ===`);
    });
  } catch (err) {
    console.error(err);
  }
}
start();
