import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button } from "antd";
import styled from "styled-components";
import { logoutAction } from "../reducers/user";
const ButtonWrapper = styled(Button)`
  margin: 10px;
`;
const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);

  const onLogOut = useCallback(() => {
    dispatch(logoutAction());
  }, []);
  return (
    <Card
      actions={[
        <div key="twit">
          짹짹
          <br />
          {me.Posts.length}
        </div>,
        <div key="followings">
          팔로잉
          <br />
          {me.Followings.length}
        </div>,
        <div key="follower">
          팔로워
          <br />
          {me.Followers.length}
        </div>,
      ]}
    >
      <Card.Meta avatar={<Avatar>{me.nickname}</Avatar>} title={me.nickname} />
      <ButtonWrapper onClick={onLogOut} loading={logOutLoading}>
        로그아웃
      </ButtonWrapper>
    </Card>
  );
};

export default UserProfile;
