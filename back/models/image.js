module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define(
    "Image",
    {
      //MySQL에서는 users 테이블 생성
      // id가 기본적으로 들어있다
      src: { type: DataTypes.STRING(200), allowNull: false },
    },
    {
      charset: "utf8mb4",
      coollate: "utf8mb4_general_ci", //한글 저장, 이모티콘 저
    }
  );
  Image.associate = (db) => {
    db.Image.belongsTo(db.Post);
  };
  return Image;
};
