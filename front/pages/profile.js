import React, { useEffect } from "react";
import AppLayout from "../components/AppLayout";
import NicknameEditForm from "../components/NicknameEditForm";
import FollowList from "../components/FollowList";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import wrapper from "../store/configureStore";
import Router from "next/router";
import Head from "next/head";
import { loadFollowers, loadFollowings, loadMyInfo } from "../reducers/user";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data);

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!(me && me.id)) {
      Router.push("/");
    }
  }, [me && me.id]);

  useEffect(() => {
    dispatch(loadFollowers());
    dispatch(loadFollowings());
  }, []);

  return (
    <>
      <Head>
        <title>프로필 | NodeBird</title>
      </Head>
      <AppLayout>
        <NicknameEditForm />
        <FollowList header="팔로잉 목록" data={me?.Followings} />
        <FollowList header="팔로워 목록" data={me?.Followers} />
      </AppLayout>
    </>
  );
};

// SSR (프론트 서버에서 실행)
export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ req }) => {
      const cookie = req ? req.headers.cookie : "";
      axios.defaults.headers.Cookie = "";
      // 쿠키가 브라우저에 있는경우만 넣어서 실행
      // (주의, 아래 조건이 없다면 다른 사람으로 로그인 될 수도 있음)
      if (req && cookie) {
        axios.defaults.headers.Cookie = cookie;
      }
      await store.dispatch(loadMyInfo());

      return {
        props: {},
      };
    }
);

export default Profile;
