import React, { useCallback, useEffect } from "react";
import { Button, Form, Input } from "antd";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";

import useInput from "../hooks/useInput";
import { loginAction } from "../reducers/user";

const LoginForm = () => {
  const [email, onChangeEmail] = useInput("");
  const [password, onChangePassword] = useInput("");
  const dispatch = useDispatch();
  const { logInLoading, logInError } = useSelector((state) => state.user);

  useEffect(() => {
    if (logInError) {
      alert(logInError);
    }
  }, [logInError]);

  const onSubmitForm = useCallback(() => {
    console.log(email, password);
    dispatch(
      loginAction({
        email: email,
        password: password,
      })
    );
  }, [email, password]);

  return (
    <Form onFinish={onSubmitForm} style={{ padding: "10px" }}>
      <div>
        <label htmlFor="useremail">이메일</label>
        <br />
        <Input
          name="user-email"
          type="email"
          value={email}
          onChange={onChangeEmail}
          required
        />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input
          name="user-password"
          value={password}
          onChange={onChangePassword}
          type="password"
          required
        />
      </div>
      <div style={{ marginTop: "10px" }}>
        <Button type="primary" htmlType="submit" loading={logInLoading}>
          로그인
        </Button>
        <Link href="/signup">
          <Button>회원가입</Button>
        </Link>
      </div>
    </Form>
  );
};

export default LoginForm;
