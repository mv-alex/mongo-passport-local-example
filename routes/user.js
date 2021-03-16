const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("./../models/User");
const bcrypt = require("bcryptjs");

router.get("/", (req, res) => {
  res.render("index", { user: req.user });
});
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
  }),
  (req, res) => {
    console.log("req.user: ", req.user);
    res.redirect("/");
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  let { name, username, password, email } = req.body;

  const usernameExist = await User.findOne({ username });
  const emailExsist = await User.findOne({ email });

  if (usernameExist) {
    return res.json("User alredy exsist");
  }
  if (emailExsist) {
    return res.json("Email alredy exsist");
  }
  //hash password
  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = new User({
    name,
    username,
    password,
    email,
  });
  await newUser.save();
  res.redirect("/login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/profile",
  (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      res.redirect("/login");
    }
    next();
  },
  (req, res) => {
    res.render("profile", { user: req.user });
  }
);

module.exports = router;
