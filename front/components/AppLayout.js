import React from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { Input, Menu, Row, Col } from "antd";
import { useState } from "react";

import UserProfile from "../components/UserProfile";
import LoginForm from "../components/LoginForm";
import styled from "styled-components";

import { useSelector } from "react-redux";
import { createGlobalStyle } from "styled-components";

const Global = createGlobalStyle`
  .ant-row {
    margin-right: 0 !important;
    margin-left: 0 !importtant;
  }
  .ant-col:first-child{
    padding-left: 0!important;
  }
  .ant-col:last-chiled{
    padding-right: 0 !important;
  }
`;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
  width: 200px;
  margin-left: 10px;
`;
// const { Search } = Input;
const onSearch = (value) => console.log(value);

const items = [
  {
    label: <Link href="/">노드버드</Link>,
    key: "mail",
  },
  {
    label: (
      <div>
        <Link href="/profile">프로필</Link>
        <SearchInput
          placeholder="input search text"
          enterButton="Search"
          onSearch={onSearch}
          // style={{
          //   verticalAlign: "middle",
          //   width: 200,
          //   marginLeft: 10,
          // }}
        />
      </div>
    ),

    key: "profile",
  },
  {
    label: <Link href="/signup">회원가입</Link>,
    key: "signup",
  },
];

let tmp = "mail";
const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [current, setCurrent] = useState(tmp);

  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
    tmp = e.key;
  };
  return (
    <div>
      <Global />
      <Row>
        <Col span={12} offset={6}>
          <Menu
            mode="horizontal"
            onClick={onClick}
            selectedKeys={[current]}
            items={items}
          />
        </Col>
      </Row>

      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a
            href="https://github.com/seroak"
            target="_blank"
            rel="noreferrer noopener"
          >
            Made by seooak
          </a>
        </Col>
      </Row>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppLayout;
