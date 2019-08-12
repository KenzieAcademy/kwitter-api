const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const { User, errorHandlerMiddleware } = require("../models");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const cryto = require("crypto");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "https://kwitter-api.herokuapp.com/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // generate a random password if the user is going to be created for the first time from a google login
        const newPassword = (await cryto.randomBytes(24))
          .toString("base64")
          .replace(/\W/g, "");

        const user = (await User.findOrCreate({
          where: { googleId: profile.id },
          defaults: {
            // todo: make username suggestions based on displayName
            // todo: make option to enter a custom username also
            username: profile.displayName.replace(" ", ""),
            displayName: profile.displayName,
            password: newPassword,
            googleId: profile.id
            // todo: download picture data if exists at photos[0].value
          }
        }))[0];
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

const validateGoogleMiddleware = passport.authenticate("google", {
  session: false,
  failWithError: true
});

passport.use(
  "jwt",
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
      session: false
    },
    async (payload, done) => {
      try {
        const user = await User.findByPk(payload.username);
        if (user === null) {
          done({
            statusCode: 404,
            message: "User does not exist"
          });
          return;
        }
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

const validateJwtMiddleware = passport.authenticate("jwt", {
  session: false,
  failWithError: true
});

module.exports = {
  validateJwtMiddleware,
  validateGoogleMiddleware,
  middleware: [passport.initialize(), errorHandlerMiddleware]
};
