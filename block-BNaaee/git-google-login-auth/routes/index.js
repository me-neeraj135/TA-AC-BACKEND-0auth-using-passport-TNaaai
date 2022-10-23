/** @format */

var express = require("express");
var passport = require(`passport`);
const { rawListeners } = require("../models/User");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get(`/success`, (req, res, next) => {
  res.render(`success`);
});

router.get(`/failure`, (req, res, next) => {
  res.render(`failure`);
});

// github strategy route

router.get(`/auth/github`, passport.authenticate(`github`));

router.get(
  `/auth/github/callback`,
  passport.authenticate(`github`, { failureRedirect: `/failure` }),

  // Successful authentication, redirect home.
  function (req, res) {
    res.redirect(`/success`);
  }
);

// google strategy route

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/success");
  }
);

// logout

router.get(`/logout`, (req, res, next) => {
  req.session.destroy();
  res.clearCookie(`connect.sid`);
  res.redirect(`/`);
});
module.exports = router;
