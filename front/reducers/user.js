import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import _ from "lodash";
import axios from "axios";
import { HYDRATE } from "next-redux-wrapper";
//Hydrate 즉 Hydration 은서버사이드렌더링을 통한 이미 그려져 불러온 HTML들과 더불어 번들링 된 JS파일들을 클라이언트 단에서 상호작용할 수 있도록 융합되는 과정

export const initialState = {
  logInLoading: false, // 로그인 시도중
  logInError: null, // 로그인 에러
  logInDone: false, // 로그인 상태 체크

  logOutLoading: false, //로그아웃 시도중
  logOutError: null, // 로그아웃 에러

  signUpLoading: false, // 회원가입 시도중
  signUpDone: false, // 회원가입 상태 체크
  signUpError: null, // 회원가입 에러

  followLoading: false, // 팔로우 시도중
  followDone: false, // 팔로우 상태 체크
  followError: null, // 팔로우 에러

  unfollowLoading: false, // 언팔로우 시도중
  unfollowDone: false, // 언팔로우 상태 체크
  unfollowError: null, // 언팔로우 에러

  loadMyInfoLoading: false, // 새로고침후 유저 정보 가져오는 시도중
  loadMyInfoDone: null, // 새로고침후 유저 정보 가져오는 상태 체크
  loadMyInfoError: false, // 새로고침후 유저 정보 가져오는 것 에러

  loadUserLoading: false, //  유저 정보 가져오는 시도중
  loadUserDone: false, //  유저 정보 가져오는 상태 체크
  loadUserError: null, //  유저 정보 가져오는 것 에러

  changeNicknameLoading: false, // 닉네임 변경을 시도중
  changeNicknameDone: null, // 닉네임 변경을 상태 체크
  changeNicknameError: false, // 닉네임 변경 중 에러

  loadFollowersLoading: false, // 팔로워 목록을 시도중
  loadFollowersDone: null, // 팔로워 목록을 상태 체크
  loadFollowersError: false, // 팔로워 목록 검색 중 에러

  loadFollowingsLoading: false, // 팔로워 목록을 시도중
  loadFollowingsDone: null, // 팔로워 목록을 상태 체크
  loadFollowingsError: false, // 팔로워 목록 검색 중 에러

  removefollowerRequestLoading: false, // 팔로워 목록을 시도중
  removefollowerRequestDone: null, // 팔로워 목록을 상태 체크
  removefollowerRequestError: false, // 팔로워 목록 검색 중 에러
  me: null,
};

export const SIGN_UP = "SIGN_UP";
export const SIGN_UP_SUCCESS = "SIGN_UP_SUCCESS";
export const LOG_IN = "LOG_IN"; // 액션의 이름
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS"; // 액션의 이름
export const LOG_IN_FAILURE = "LOG_IN_FAILURE"; // 액션의 이름
export const LOG_OUT = "LOG_OUT";

export const ADD_POST_TO_ME = "ADD_POST_TO_ME"; // post 추가하는 액션
export const REMOVE_POST_OF_ME = "REMOVE_POST_OF_ME"; // post 삭제하는 액션

export const FOLLOW_REQUEST = "FOLLOW_REQUEST"; // 팔로우 하는 액션
export const UNFOLLOW_REQUEST = "UNFOLLOW_REQUEST"; // 언팔로우 하는 액션

// const dummyUser = (data) => ({
//   ...data,
//   nickname: "제로초",
//   id: 1,
//   Posts: [{ id: 1 }],
//   Followings: [{ id: "부기초" }, { id: "Chanho park" }, { id: "PAKA" }],
//   Followers: [{ id: "부기초" }, { id: "Chanho park" }, { id: "PAKA" }],
// });

// const wait = (timeToDelay) =>
//   new Promise((resolve) => setTimeout(resolve, timeToDelay));

export const loginAction = createAsyncThunk(
  "user/login",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.post("/user/login", data);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response);
    }
  }
);

// export const loginAction = (data) => {
//   return {
//     type: LOG_IN,
//     data,
//   };
// };

export const logoutAction = createAsyncThunk(LOG_OUT, async () => {
  const response = await axios.post("/user/logout");
  return response.data;
});

// export const logoutAction = {
//   type: LOG_OUT,
// };

export const signUp = createAsyncThunk(
  "user/signup",
  async (data, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await axios.post("/user", data);
      // response data안에config.data에 회원가입 정보들이 들어있다
      return fulfillWithValue(response.config.data);
    } catch (error) {
      //error.response.data 안에 send로 보낸 message가 들어있다
      throw rejectWithValue(error.response.data);
    }
  }
);

// export const signUp = (data) => {
//   return {
//     type: SIGN_UP,
//     data,
//   };
// };
export const followRequest = createAsyncThunk(
  "/user/follow",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.patch(`/user/${data}/follow`, data);

      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const unfollowRequest = createAsyncThunk(
  "user/unfollow",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.delete(`/user/${data}/follow`, data);
      console.log(response);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const loadMyInfo = createAsyncThunk("/user/LoadMyInfo", async (data) => {
  const response = await axios.get("/user", data);
  return response.data;
});

export const loadUser = createAsyncThunk("user/loadUser", async (data) => {
  console.log("맞지?");
  console.log(data.userId);
  const response = await axios.get(`/user/${data.userId}`);
  console.log(response.data);
  return response.data;
});

export const changeNickname = createAsyncThunk(
  "/user/nickname",
  async (data) => {
    const response = await axios.patch("/user/nickname", { nickname: data });
    return response.data;
  }
);

export const loadFollowers = createAsyncThunk(
  "/user/loadFollowers",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.get("/user/followers");
      console.log(response);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);

export const loadFollowings = createAsyncThunk(
  "/user/loadFollowings",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.get("/user/followings");
      console.log(response);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);
export const removefollowerRequest = createAsyncThunk(
  "/user/removeFollower",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.delete(`/user/follower/${data}`);
      console.log(response);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response.data);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addPostToMe(draft, action) {
      // 값을 하나만 전달해서 값이 바로 payload에 저장이된다
      // 내가 만든 포스트를 me state에 저장하는 reducer
      draft.me.Posts.unshift({ id: action.payload });
    },
    removePostOfMe(draft, action) {
      draft.me.Posts = draft.me.Posts.filter((v) => v.id !== action.payload);
    },
  },
  // 외부에서 action을 만든것은 extraReducers로 가져와서 사용한다 주로 createAsyncThunk로 action을 만들 때 사용한다
  extraReducers: (builder) =>
    builder
      .addCase(HYDRATE, (state, action) => ({
        ...state,
        ...action.payload.user,
      }))
      .addCase(loginAction.pending, (state) => {
        state.logInLoading = true;
        state.logInDone = false;
      })
      .addCase(loginAction.fulfilled, (state, action) => {
        state.logInLoading = false;
        state.logInDone = true;
        state.me = action.payload;
        state.loginData = action.payload;
      })
      .addCase(loginAction.rejected, (state, action) => {
        state.logInLoading = false;
        state.logInError = action.payload.data.message;
      })
      .addCase(logoutAction.pending, (state) => {
        state.logOutLoading = true;
        state.logInDone = true;
      })
      .addCase(logoutAction.fulfilled, (state) => {
        state.logOutLoading = false;
        state.logInDone = false;
        state.me = null;
      })
      .addCase(logoutAction.rejected, (state, action) => {
        state.logOutLoading = false;
        state.logOutError = action.payload;
      })
      //signUp 리듀서
      .addCase(signUp.pending, (state, action) => {
        state.signUpLoading = true;
        state.signUpDone = false;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUpLoading = false;
        state.signUpDone = true;
        state.signUpData = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUpError = action.payload;
      })
      // 팔로우 리듀서
      .addCase(followRequest.pending, (state, action) => {
        state.followLoading = true;
        state.followError = null;
        state.followDone = false;
      })
      .addCase(followRequest.fulfilled, (state, action) => {
        state.followLoading = false;
        state.followDone = true;
        state.me.Followings.push({ id: action.payload.Userid });
      })
      .addCase(followRequest.rejected, (state, action) => {
        state.followError = action.error;
      })
      // 언팔로우 리듀서
      .addCase(unfollowRequest.pending, (state, action) => {
        state.unfollowLoading = true;
      })
      .addCase(unfollowRequest.fulfilled, (state, action) => {
        state.unfollowLoading = false;
        state.unfollowDone = true;
        state.me.Followings = state.me.Followings.filter(
          (v) => v.id !== action.payload.Userid
        );
      })
      .addCase(unfollowRequest.rejected, (state, action) => {
        state.unfollowError = action.error;
      })
      // 새로고침 후 유저정보 가져오는 리듀서
      .addCase(loadMyInfo.pending, (state, action) => {
        state.loadMyInfoLoading = true;
        state.loadMyInfoError = null;
        state.loadMyInfoDone = false;
      })
      .addCase(loadMyInfo.fulfilled, (state, action) => {
        state.loadMyInfoLoading = false;
        state.me = action.payload;
        state.loadMyInfoDone = true;
      })
      .addCase(loadMyInfo.rejected, (state, action) => {
        state.loadMyInfoLoading = false;
        state.loadMyInfoError = action.error;
      })
      // 다른유저정보 가져오는 리듀서
      .addCase(loadUser.pending, (draft) => {
        draft.loadUserLoading = true;
        draft.loadUserError = null;
        draft.loadUserDone = false;
      })
      .addCase(loadUser.fulfilled, (draft, action) => {
        draft.loadUserLoading = false;
        draft.userInfo = action.payload;
        draft.loadUserDone = true;
      })
      .addCase(loadUser.rejected, (draft, action) => {
        draft.loadUserLoading = false;
        draft.loadUserError = action.error;
      })
      // 유저 닉네임을 변경하는 리듀서
      .addCase(changeNickname.pending, (state, action) => {
        console.log(action);
        state.changeNicknameLoading = true;
        state.changeNicknameError = null;
        state.changeNicknameDone = false;
      })
      .addCase(changeNickname.fulfilled, (state, action) => {
        console.log(action);
        state.me.nickname = action.payload.nickname;
        state.changeNicknameLoading = false;
        state.changeNicknameDone = true;
      })
      .addCase(changeNickname.rejected, (state, action) => {
        console.log(action);
        state.changeNicknameLoading = false;
        state.changeNicknameError = action.error;
      })
      // 팔로워 목록을 가져오는 리듀서
      .addCase(loadFollowers.pending, (state, action) => {
        console.log(action);
        state.loadFollowersLoading = true;
        state.loadFollowersError = null;
        state.loadFollowersDone = false;
      })
      .addCase(loadFollowers.fulfilled, (state, action) => {
        console.log(action);
        state.me.Followers = action.payload;
        state.loadFollowersLoading = false;
        state.loadFollowersDone = true;
      })
      .addCase(loadFollowers.rejected, (state, action) => {
        console.log(action);
        state.loadFollowersLoading = false;
        state.loadFollowersError = action.error;
      })
      // 팔로잉 목록을 가져오는 리듀서
      .addCase(loadFollowings.pending, (state, action) => {
        console.log(action);
        state.loadFollowingsLoading = true;
        state.loadFollowingsError = null;
        state.loadFollowingsDone = false;
      })
      .addCase(loadFollowings.fulfilled, (state, action) => {
        console.log(action);
        state.me.Followings = action.payload;
        state.loadFollowingsLoading = false;
        state.loadFollowingsDone = true;
      })
      .addCase(loadFollowings.rejected, (state, action) => {
        console.log(action);
        state.loadFollowingsLoading = false;
        state.loadFollowingsError = action.error;
      })
      // 팔로워 차단하는 가져오는 리듀서
      .addCase(removefollowerRequest.pending, (state, action) => {
        console.log(action);
        state.removefollowerRequestLoading = true;
        state.removefollowerRequestError = null;
        state.removefollowerRequestDone = false;
      })
      .addCase(removefollowerRequest.fulfilled, (state, action) => {
        console.log(action);
        state.me.Followers = state.me.Followers.filter(
          (v) => v.id !== action.payload.UserId
        );
        state.removefollowerRequestLoading = false;
        state.removefollowerRequestDone = true;
      })
      .addCase(removefollowerRequest.rejected, (state, action) => {
        console.log(action);
        state.removefollowerRequestLoading = false;
        state.removefollowerRequestError = action.error;
      })
      .addDefaultCase((state) => state),
});

export const { addPostToMe, removePostOfMe } = userSlice.actions;
export default userSlice;
