var GoogleStrategy = require('passport-google-oauth20').Strategy;

require("dotenv").config()
let googleAuth=(passport)=>{


passport.use(new GoogleStrategy({
    clientID:process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
console.log(profile);
   return done(null, profile)
  }
));
passport.serializeUser((user,done)=>{
    return done(null,user)
})
passport.deserializeUser((user,done)=>{

    return done(null,user)
})
}

module.exports =googleAuth