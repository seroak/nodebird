module.exports = (sequelize, DataTypes) => {
  const Hashtag = sequelize.define(
    "Hashtag",
    {
      //MySQL에서는 users 테이블 생
      // id가 기본적으로 들어있다
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
    },
    {
      charset: "utf8mb4",
      coollate: "utf8mb4_general_ci", //한글 저장, 이모티콘 저
    }
  );
  Hashtag.associate = (db) => {
    db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" });
  };
  return Hashtag;
};
