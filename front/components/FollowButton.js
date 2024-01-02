import React, { useCallback } from "react";
import { Button } from "antd";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { followRequest, unfollowRequest } from "../reducers/user";
const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const { me, followLoading, unfollowLoading } = useSelector(
    (state) => state.user
  );

  const isFollowing = me.Followings.find((v) => v.id === post.User.id);

  // console.log("post.user.id", post.User);
  // console.log(
  //   "isFollowing",
  //   me.Followings.find((v) => v.id === "PKA")
  // );
  const onClickButton = useCallback(() => {
    if (!isFollowing) {
      dispatch(followRequest(post.User.id));
    } else {
      dispatch(unfollowRequest(post.User.id));
    }
  }, [isFollowing]);
  if (post.User.id === me.id) {
    return null;
  }

  return (
    <Button loading={followLoading || unfollowLoading} onClick={onClickButton}>
      {isFollowing ? "언팔로우" : "팔로우"}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.object.isRequired,
};

export default FollowButton;
