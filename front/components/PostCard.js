import React, { useState, useCallback, useEffect } from "react";
import { Card, Button, Avatar, Popover, List } from "antd";
import PropTypes from "prop-types";
import {
  RetweetOutlined,
  HeartTwoTone,
  HeartOutlined,
  MessageOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import {
  removePost,
  likePostRequest,
  unlikePostRequest,
  retweet,
} from "../reducers/post";
import { removePostOfMe } from "../reducers/user";
import CommentForm from "./CommentForm";

import PostImages from "./PostImages";
import PostCardContent from "./PostCardContent";
import FollowButton from "./FollowButton";
const CardWrapper = styled.div`
  margin-bottom: 20px;
`;

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector((state) => state.user.me && state.user.me.id);
  const { addRemoveLoading } = useSelector((state) => state.post);

  const onLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    dispatch(likePostRequest(post.id));
  }, [id]);

  const onUnLike = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    dispatch(unlikePostRequest(post.id));
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    dispatch(
      removePost({
        postId: post.id,
      })
    );
    dispatch(removePostOfMe(post.id));
  }, [id]);

  const onToggleComment = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    setCommentFormOpened((prev) => !prev);
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert("로그인이 필요합니다.");
    }
    dispatch(retweet(post.id));
  }, [id]);

  const liked = post.Likers.find((v) => v.id === id);
  return (
    <CardWrapper key={post.id}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked ? (
            <HeartTwoTone
              twoToneColor="#eb2f96"
              key="heart"
              onClick={onUnLike}
            />
          ) : (
            <HeartOutlined key="heart" onClick={onLike} />
          ),
          <MessageOutlined key="message" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {id && post.User.id === id ? (
                  <>
                    <Button>수정</Button>
                    <Button
                      type="danger"
                      loading={addRemoveLoading}
                      onClick={onRemovePost}
                    >
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗하셨습니다.` : null
        }
        extra={id && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />}
            />
          </Card>
        ) : (
          <Card.Meta
            avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />}
          />
        )}
      </Card>
      {commentFormOpened && (
        <>
          <CommentForm post={post} />
          <List
            style={{ maring: 0 }}
            header={`${post.Comments.length}개의 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={<div>{item.User.nickname}</div>}
                  avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
                  description={item.content}
                />
              </List.Item>
            )}
          />
        </>
      )}
    </CardWrapper>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.object,
    content: PropTypes.string,
    createdAt: PropTypes.object,
    Comments: PropTypes.arrayOf(PropTypes.any),
    Images: PropTypes.arrayOf(PropTypes.any),
    Likers: PropTypes.arrayOf(PropTypes.object),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }),
};

export default PostCard;
