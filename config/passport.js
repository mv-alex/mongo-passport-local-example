// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./../models/User");

const options = {
  usernameField: "username",
  passwordField: "password",
  passReqToCallback: false,
};
function verifyPassword(user, password) {
  return user.password === password;
}

async function verify(username, password, done) {
  try {
    let user = await User.findOne({ username: username });
    if (!user) {
      console.log("User not found");
      return done(null, false);
    }
    if (!verifyPassword(user, password)) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    console.log(err);
    return done(err);
  }
}
module.exports = (passport) => {
  //  Добавление стратегии для использования
  passport.use("local", new LocalStrategy(options, verify));
  // Конфигурирование Passport для сохранения пользователя в сессии
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });
  passport.deserializeUser(async (id, cb) => {
    await User.findById(id, (err, user) => {
      if (err) {
        return cb(err);
      }
      cb(null, user);
    });
  });
};
