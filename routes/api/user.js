const express = require("express");
const router = express.Router();
const passport = require("passport");

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
