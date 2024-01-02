import { Form, Input, Button } from "antd";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { addComment } from "../reducers/post";
import useInput from "../hooks/useInput";

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentLoading } = useSelector((state) => state.post);
  const { addCommentDone } = useSelector((state) => state.post);
  const [commentText, onChangeCommentText, setCommentText] = useInput("");
  useEffect(() => {
    if (addCommentDone) {
      setCommentText("");
    }
  }, [addCommentDone]);

  // dispatch함수를 사용하면 redux함수를 작동 시킬 수 있다
  // action.payload에 값들이 저장된
  const onSubmitComment = useCallback(() => {
    dispatch(addComment({ content: commentText, postId: post.id, userId: id }));
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: "relative", margin: 0 }}>
        <Input.TextArea
          value={commentText}
          onChange={onChangeCommentText}
          rows={4}
        />
        <Button type="primary" htmlType="submit" loading={addCommentLoading}>
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};
CommentForm.propTypes = {
  post: PropTypes.object.isRequired,
};

export default CommentForm;
