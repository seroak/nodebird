import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";

import { Avatar, Card } from "antd";
import AppLayout from "../components/AppLayout";
import wrapper from "../store/configureStore";
import { loadUserInfo } from "../reducers/user";

const Profile = () => {
  const { userInfo } = useSelector((state) => state.user);

  return (
    <AppLayout>
      <Head>
        <title>ZeroCho | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">
              짹짹
              <br />
              {userInfo.Posts.length}
            </div>,
            <div key="following">
              팔로잉
              <br />
              {userInfo.Followings.length}
            </div>,
            <div key="follower">
              팔로워
              <br />
              {userInfo.Followers.length}
            </div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="노드버드 매니아"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

// getStaticProps는 동적인 데이터는 못건든다 정적인 데이터만 가능
export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ req }) => {
      console.log("getStaticProps");
      await store.dispatch(loadUserInfo(1));
    }
);

export default Profile;
