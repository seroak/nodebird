const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const bcrypt = require("bcrypt");
const { User } = require("../models");
module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          // 기존 유저가 있는지 확인
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            //서버에러 /성공여부/클라이언트 에러
            //이메일이 존재하지 않을 때
            return done(null, false, { reason: "존재하지 않는 이메일입니다!" });
          }
          const result = await bcrypt.compare(password, user.password);
          //비밀번호도 맞을 때
          if (result) {
            return done(null, user);
          }
          //비밀번호가 틀릴 때
          return done(null, false, { reason: "비밀번호가 틀렸습니다" });
        } catch (error) {
          //서버 에러
          console.error(error);
          return done(error);
        }
      }
    )
  );
};
