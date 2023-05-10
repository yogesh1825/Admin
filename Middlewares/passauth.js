const user = require("../models/user");

const localStrtegy = require("passport-local").Strategy;
const passportAuth = (passport) => {
  passport.use(
    new localStrtegy(async (username, password, done) => {
      let User = await user.findOne({ username: username });
      try {
        if (!User) {
          return done(null, false);
        }
        if (User.password !== password) {
          return done(null, false);
        }
        return done(null, User);
      } catch (error) {
        return done(error, false);
      }
    })
  );

  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    let User = await user.findById(id);
    done(null, User);
  });
};
module.exports = passportAuth;
