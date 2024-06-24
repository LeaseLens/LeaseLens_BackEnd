const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const { User } = require('../models');
const bcrypt = require('bcrypt');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField: 'user_ID',
    passwordField: 'user_pw',
  }, async (user_ID, user_pw, done) => {
    try {
      const user = await User.findOne({
        where: { user_ID }
      });
      if (!user) {
        return done(null, false, { message: '존재하지 않는 사용자입니다만!' }); //output: {}.    message 출력이 안되므로 수정 필요
      }
      const result = await bcrypt.compare(user_pw, user.user_pw);
      if (result) {
        return done(null, user);
      }
      return done(null, false, { message: '비밀번호가 틀렸습니다.' }); //output: {}.    message 출력이 안되므로 수정 필요
    } catch (err) {
      return done(err);
    }
  }));
};
