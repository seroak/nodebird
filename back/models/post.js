module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    "Post",
    {
      //MySQL에서는 users 테이블 생
      // id가 기본적으로 들어있다
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      coollate: "utf8mb4_general_ci", //한글 저장, 이모티콘 저
    }
  );
  // 관계를 지어주면 add, remove의 메서드가 생성된다
  Post.associate = (db) => {
    db.Post.belongsTo(db.User); //post.addUser, post.getUser, post.setUser
    db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); //post.addHashtags
    db.Post.hasMany(db.Comment); //post.addComments, post.getComments
    db.Post.hasMany(db.Image); //post.addImages
    //사용자랑 게시물의 좋아요 관계 중간 테이블 이름은 through를 통해 정할 수 있다
    //as의 용도는 post.getLikers처럼 게시글 좋아요 누른 사람을 가져오게 된다
    db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.remove
    //리트윗 관계 표현
    db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addRetweet
  };
  return Post;
};
