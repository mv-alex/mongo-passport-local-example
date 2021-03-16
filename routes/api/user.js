const express = require("express");
const router = express.Router();
const passport = require("passport");
const { userValidator } = require("./../../validation");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

router.post(
  "/login",
  passport.authenticate("local", {
    failureMessage: "user not found",
  }),
  (req, res) => {
    console.log("req.user: ", req.user);
    res.status(200).json({
      ok: "success login!",
    });
  }
);

router.post("/signup", userValidator, async (req, res) => {
  let { name, username, password, email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
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
  res.status(201).json({ ok: "you signup!" });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.status(200).json({ status: "success logout" });
});

router.get(
  "/profile",
  (req, res, next) => {
    if (!req.isAuthenticated || !req.isAuthenticated()) {
      if (req.session) {
        req.session.returnTo = req.originalUrl || req.url;
      }
      return res.status(404).json({
        fail: "Unauthorize",
      });
    }
    next();
  },
  (req, res) => {
    res.status(200).json({ user: req.user });
  }
);

module.exports = router;
