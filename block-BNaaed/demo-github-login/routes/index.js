/** @format */

var express = require("express");
var passport = require(`passport`);
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

router.get(`/auth/github`, passport.authenticate(`github`));

// app.get(
//   "/auth/github",
//   passport.authenticate("github", { scope: ["user:email"] })
// );

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/failure",
  }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect(`/success`);
  }
);
module.exports = router;
