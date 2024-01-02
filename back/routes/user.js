const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

// db로 가지고 오면 db.User이렇게 해야하는데 구조분해 할당하면 바로 사용할 수 있다
// const db = require('../models')
// router.post("/", (req, res) => {// POST /user/
//     db.User
// });
const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");

const router = express.Router();

router.get("/", async (req, res, next) => {
  //loadMyInfo
  console.log(req.headers);
  try {
    if (req.user) {
      // findOne에서 에러가 생기는 거는 try catch문으로 처리가 안된
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      res.status(200).json(fullUserWithoutPassword);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    console.log("userId", req.params.userId);
    if (req.user) {
      // findOne에서 에러가 생기는 거는 try catch문으로 처리가 안된
      const fullUserWithoutPassword = await User.findOne({
        where: { id: req.params.userId },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      if (fullUserWithoutPassword) {
        console.log(fullUserWithoutPassword);
        res.status(200).json(fullUserWithoutPassword);
      }
    } else {
      res.status(404).json("존재하지 않는 사용자입니다");
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/:userId/posts", async (req, res, next) => {
  // GET /user/1/posts
  try {
    const where = { UserId: req.params.userId };
    if (parseInt(req.query.lastId, 10)) {
      // 초기 로딩이 아닐 때
      where.id = { [Op.lt]: parseInt(req.query.lastId, 10) };
    } // 21 20 19 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
    const posts = await Post.findAll({
      where,
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: Comment,
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
              order: [["createdAt", "DESC"]],
            },
          ],
        },
        {
          model: User, // 좋아요 누른 사람
          as: "Likers",
          attributes: ["id"],
        },
        {
          model: Post,
          as: "Retweet",
          include: [
            {
              model: User,
              attributes: ["id", "nickname"],
            },
            {
              model: Image,
            },
          ],
        },
      ],
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    next(error);
  }
});
// POST /user/login
// 미들웨어 확장 기법
router.post("/login", isNotLoggedIn, (req, res, next) =>
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send({ message: info.reason });
    }
    return req.login(user, async (loginErr) => {
      if (loginErr) {
        console.error(loginErr);
        return next(loginErr);
      }
      const fullUserWithoutPassword = await User.findOne({
        where: { id: user.id },
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: Post,
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followings",
            attributes: ["id"],
          },
          {
            model: User,
            as: "Followers",
            attributes: ["id"],
          },
        ],
      });
      //쿠키랑 정보를 같이 보내준다
      console.log(req.session);
      return res.status(200).json(fullUserWithoutPassword);
    });
  })(req, res, next)
);

router.post("/", isNotLoggedIn, async (req, res) => {
  // POST /user/

  try {
    const exUser = await User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      return res.status(403).send({ message: "이미 사용중인 아이디입니다." });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // app에 설치한 미들웨어 때문에 req.body로 데이터를 받을 수 있다
    await User.create({
      email: req.body.email,
      nickname: req.body.nickname,
      password: hashedPassword,
    });
    //201은 잘 생성됨
    res.status(201).send("ok");
  } catch (error) {
    console.error(error);
    //next(error) 에러 처리 미들웨어 바로 app.js에 에러 처리 미들웨어로 간다
    next(error); // status 500
  }
});

router.post("/logout", isLoggedIn, async (req, res, next) => {
  req.logout(() => {
    res.send("ok");
  });
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user.id },
      }
    );
    res.status(200).json({ nickname: req.body.nickname });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로우 하기
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
  //PATCH /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    console.log(user);
    if (!user) {
      return res.status(403).send("없는 사람을 팔로우 하시네요?");
    }
    await user.addFollowers(req.user.id);
    // 이렇게 res.json으로 보내면 redux payload에 담긴다
    res.json({ Userid: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로우 취소
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
  //delete /user/1/follow
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("없는 사람을 언팔로우 하시네요?");
    }
    await user.removeFollowers(req.user.id);
    // 이렇게 res.json으로 보내면 redux payload에 담긴다
    res.json({ Userid: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로워 목록 가져오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
  //GET /user/followers
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    console.log(user);
    const followers = await user.getFollowers();
    console.log(followers);
    // 이렇게 res.json으로 보내면 redux payload에 담긴다
    res.status(200).json(followers);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로잉 목록 가져오기
router.get("/followings", isLoggedIn, async (req, res, next) => {
  //GET /user/followings
  try {
    const user = await User.findOne({ where: { id: req.user.id } });

    if (!user) {
      return res.status(403).send("없는 사람을 찾으려고 하시네요?");
    }
    const followings = await user.getFollowings();
    console.log(followings);
    // 이렇게 res.json으로 보내면 redux payload에 담긴다
    res.status(200).json(followings);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

//팔로워 제거 차단하기
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
  //delete /user/follower/2
  try {
    const user = await User.findOne({ where: { id: req.params.userId } });
    if (!user) {
      return res.status(403).send("없는 사람을 차단하려고 하시네요?");
    }
    await user.removeFollowings(req.user.id);
    // 이렇게 res.json으로 보내면 redux payload에 담긴다
    res.status(200).json({ UserId: parseInt(req.params.userId, 10) });
  } catch (error) {
    console.error(error);
    next(error);
  }
});
module.exports = router;
