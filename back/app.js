const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

const postRouter = require("./routes/post");
const userRouter = require("./routes/user");
const postsRouter = require("./routes/posts");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const passportConfig = require("./passport");

dotenv.config();
const app = express();

//app.js에서 sequelize를 가지고 와서 실행시키는 구문
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);
passportConfig();

app.use(morgan("dev"));
app.use(
  cors({
    //origin: true 로 해도 된다
    //다만 그렇게 되면 모든 요청을 허용한다는 뜻으로 보안에는 안 좋다
    origin: "http://localhost:3060",
    credentials: true,
  })
);
app.use("/", express.static(path.join(__dirname, "uploads")));
// axios 요청으로 들어온 data를 req.body에 넣어주는 미들웨어
//fornt에서 json형식으로 데이터를 보내줄떄 처리하는 미들웨어
app.use(express.json());
//front에서 form형식으로 데이터를 보냈을 때 처리하는 미들웨어
app.use(express.urlencoded({ extended: true }));
//session 처리하는 미들웨어
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// 브라우저에서 백앤드 서버로 오는 요청을 허용하는 것
// app.use(cors({
//   실무에서 이런식으로 특정 브라우저에서 온 요청만 허용하게 한다
//   origin: 'https://nodebird.com'
// }));

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

// 에러 처리 미들웨어 구문 이런식으로 에러처리 미들웨어를 만들 수 있지만
//기본적으로 에러처리 미들웨어를 제공하기 때문에 굳이 만들 필요는 없다
// app.use((err, req, res, next)=>{

// });

app.listen(3065, () => {
  console.log("서버 실행 중");
});
