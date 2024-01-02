module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      //MySQL에서는 users 테이블 생
      // id가 기본적으로 들어있다
      email: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수
        unique: true, // 고유한 값
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false, //필수
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false, //필수
      },
      //
    },
    {
      charset: "utf8",
      coollate: "utf8_general_ci", //한글 저장
    }
  );
  User.associate = (db) => {
    db.User.hasMany(db.Post);
    db.User.hasMany(db.Comment);
    //사용자랑 게시물의 좋아요 관계 중간 테이블 이름은 through를 통해 정할 수 있다
    //post.getLiked처럼 내가 좋아요 누른 게시물 가져오게 된다
    db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
    //같은 테이블로 중간 테이블을 만들 때 foreignkey 설정을 하는 이유는 설정을 안하면
    //id가 UserId로 만들어져서 구별이 안되기 때문에 이름을 따로 지정해준다
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followers",
      foreignKey: "FollowingId",
    });
    db.User.belongsToMany(db.User, {
      through: "Follow",
      as: "Followings",
      foreignKey: "FollowerId",
    });
  };
  return User;
};
