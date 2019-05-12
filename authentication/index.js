const passport = require("passport");
const { ExtractJwt } = require("passport-jwt");
const { Strategy } = require("passport-jwt");
const { User } = require("../models");

passport.use(
  "jwt",
  new Strategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id);
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

const jwtAuthMiddleware = passport.authenticate("jwt", {
  session: false,
  failWithError: true
});

module.exports = {
  jwtAuthMiddleware
};
