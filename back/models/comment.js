module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    "Comment",
    {
      //MySQL에서는 users 테이블 생
      // id가 기본적으로 들어있다
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      //belongsTo의 역할
      //UserId:
      //PostId:
      //이렇게 belongsTo가 가상의 컬럼을 만들어 준다
    },
    {
      charset: "utf8mb4",
      coollate: "utf8mb4_general_ci", //한글 저장, 이모티콘 저
    }
  );
  Comment.associate = (db) => {
    db.Comment.belongsTo(db.User);
    db.Comment.belongsTo(db.Post);
  };
  return Comment;
};
