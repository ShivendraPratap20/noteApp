const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../db/model/userModel");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_KEY,
    callbackURL: "/auth/google/callback"
  },
  async(accessToken, refreshToken, profile, cb)=> {
    try {
      let user = await userModel.findOne({ userID:profile.emails[0].value });
      if(!user){
        user = await userModel.create({
            googleId: profile.id,
            userName:profile.displayName,
            userID:profile.emails[0].value     
        })
      }

      return cb(null, user);

    } catch (error) {
        return cb(error, null)
    }
  }
));