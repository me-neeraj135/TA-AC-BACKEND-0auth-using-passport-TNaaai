/** @format */
const { request } = require("express");
var passport = require(`passport`);
var GitHubStrategy = require(`passport-github`).Strategy;
var GoogleStrategy = require(`passport-google-oauth20`).Strategy;

var User = require(`../models/User`);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `/auth/github/callback`,
    },
    (accessToken, refreshToken, profile, cb) => {
      var email = profile._json.email;

      var githubUser = {
        email: email,
        providers: [profile.provider],
        github: {
          name: profile._json.name,
          username: profile.username,
          avatar: profile._json.avatar_url,
        },
      };

      User.findOne({ email }, (err, user) => {
        if (err) return cb(err, false);
        // console.log(user);

        if (!user) {
          User.create(githubUser, (err, user) => {
            if (err) return cb(err, false);
            cb(null, user);
          });
        } else {
          if (user.providers.includes(profile.provider)) {
            return cb(err, user);
          } else {
            user.providers.push(profile.provider);
            user.github = { ...githubUser.github };
            user.save((err, updatedUser) => {
              if (err) return cb(err, false);
              cb(null, updatedUser);
            });
          }
        }
      });
    }
  )
);

// google strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, cb) => {
      var email = profile._json.email;
      var googleUser = {
        email: email,
        providers: [profile.provider],
        google: {
          name: profile._json.name,
          avatar: profile._json.picture,
        },
      };

      User.findOne({ email }, (err, user) => {
        // console.log(user);
        if (err) return cb(err, false);
        if (!user) {
          User.create(googleUser, (err, user) => {
            if (err) return cb(err, user);
            cb(null, user);
          });
        } else {
          if (user.providers.includes(profile.provider)) {
            return cb(null, user);
          } else {
            user.providers.push(profile.provider);
            user.google = { ...googleUser.google };
            user.save((err, updatedUser) => {
              if (err) return cb(err, false);
              cb(null, updatedUser);
            });
          }
        }
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id, "name email username", function (err, user) {
    cb(err, user);
  });
});
