const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user)).catch(err => done(err));
  });

  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        const user = await User.findOne({ $or: [{ email: username }, { username }] });
        if (!user || !(await user.isValidPassword(password))) {
          return done(null, false, { message: 'Invalid credentials' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  ));

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  }, async (token, tokenSecret, profile, done) => {
    console.log("enter Google Strategy area");
    console.log(profile);
    try {
      let user = await User.findOne({socialMediaId: profile.id });
      if (!user) {
        user = new User({ loginMethod: "Google",
                          socialMediaId: profile.id, 
                          username: profile.id,
                          name: profile.displayName,
                          email: profile.emails[0].value,
                          thumbnail: profile.photos[0].value});
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id','displayName','email', 'photos'],
  }, async (token, tokenSecret, profile, done) => {
    console.log("enter Facebook Strategy area");
    console.log(profile);
    try {
      let user = await User.findOne({socialMediaId: profile.id });
      if (!user) {
        user = new User({ loginMethod: "Facebook",
                          socialMediaId: profile.id,
                          username: profile.id, 
                          name: profile.displayName,
                          email: profile.emails[0].value,
                          thumbnail: profile.photos[0].value});
        await user.save();
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));
};
