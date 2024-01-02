import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { throttle } from "lodash";
import axios from "axios";
import { HYDRATE } from "next-redux-wrapper";
// import shortId from "shortid";
// import { faker } from "@faker-js/faker";

// faker.seed(24);
export const initialState = {
  mainPosts: [],
  singlePost: null,
  imagePaths: [],
  hasMorePosts: true,
  addPostLoading: false,
  addPostDone: false,
  addPostError: null,
  addCommentLoading: false,
  addCommentDone: false,
  addCommentError: null,
  addRemoveLoading: false,
  addRemoveDone: false,
  addRemoveError: null,
  loadPostsLoading: false,
  loadPostsDone: false,
  loadPostsError: null,
  loadPostLoading: false,
  loadPostDone: false,
  loadPostError: null,
  likePostLoading: false,
  likePostDone: false,
  likePostError: null,
  unlikePostLoading: false,
  unlikePostDone: false,
  unlikePostError: null,
  removePostLoading: false,
  removePostDone: false,
  removePostError: null,
  uploadImagesLoading: false,
  uploadImagesDone: false,
  uploadImagesError: null,

  retweetLoading: false,
  retweetDone: false,
  retweetError: null,

  submitImageLoading: false,
  submitImageDone: false,
  submitImageError: null,

  submitReportLoading: false,
  submitReportDone: false,
  submitReportError: null,
};

export const postInitialState = initialState;
// export const generateDummpyPost = (number) =>
//   Array(number)
//     .fill()
//     .map(() => ({
//       id: shortId.generate(),
//       User: {
//         id: shortId.generate(),
//         nickname: faker.name.fullName(),
//       },
//       content: faker.lorem.paragraph(),
//       Images: [
//         {
//           src: faker.image.image(),
//         },
//       ],
//       Comments: [
//         {
//           User: {
//             id: shortId.generate(),
//             nickname: faker.name.fullName(),
//           },
//           content: faker.lorem.sentence(),
//         },
//       ],
//     }));

// const dummyComment = (data) => ({
//   id: shortId.generate(),
//   content: data,
//   User: {
//     id: 1,
//     nickname: "제로초",
//   },
// });

// const wait = (timeToDelay) =>
//   new Promise((resolve) => setTimeout(resolve, timeToDelay));

// export const ADD_POST = "ADD_POST";
// export const ADD_COMMENT = "ADD_COMMENT";
// export const REMOVE_POST = "REMOVE_POST";
// export const LOAD_POST = "LOAD_POST";

//action creator
export const addPost = createAsyncThunk(
  "/post/addPost",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      // formData는 브라우저 정책때문에 그냥 console.log를 찍는다고 볼 수 없다 이렇게 반복문을 돌려서 확인해야한다
      // for (let key of data.keys()) {
      //   console.log(key);
      // }
      // for (let value of data.values()) {
      //   console.log(value);
      // }
      // console.log(data.name);
      console.log(data);
      const response = await axios.post("/post", data);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response);
    }
  }
);

export const removePost = createAsyncThunk("/post/remove", async (data) => {
  const response = await axios.delete(`/post/${data.postId}/remove`);
  return response.data;
});

export const addComment = createAsyncThunk("post/comment", async (data) => {
  const response = await axios.post(`/post/${data.postId}/comment`, data);
  return response.data;
});

// 비동기 요청을 넣어야하는데 프론트로만 할 떄는 가짜 비동기 요청을 만들어야해서 setTimeout으로 해결
const fetchDataFromServer = async (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), 5000); // Simulate async fetch with a delay of 1 second
  });
};

const throttledFetchData = throttle(fetchDataFromServer, 5000);
// 게시글 여러개 로드
export const loadPosts = createAsyncThunk("/postloadposts", async (lastId) => {
  throttledFetchData();
  const response = await axios.get(`/posts?lastId=${lastId || 0}`);
  return response.data;
});

// 게시글 하나만 로드
export const loadPost = createAsyncThunk("post/loadpost", async (data) => {
  console.log(data);
  const response = await axios.get(`/post/${data.postId}`);
  console.log(response.data);
  return response.data;
});

//유저가 쓴 모든 게시글 로드
const loadUserPostsThrottle = async ({ id, lastId }) => {
  const response = await axios.get(`/user/${id}/posts?lastId=${lastId || 0}`);
  return response.data;
};

export const loadUserPosts = createAsyncThunk(
  "post/loaduserpost",
  throttle(loadUserPostsThrottle, 5000)
);

const loadHashtagPostsThrottle = async ({ lastId, tag }) => {
  const response = await axios.get(
    `/hashtag/${encodeURIComponent(tag)}?lastId=${lastId || 0}`
  );
  return response.data;
};

export const loadHashtagPosts = createAsyncThunk(
  "post/loadHashtagPosts",
  throttle(loadHashtagPostsThrottle, 5000)
);

export const likePostRequest = createAsyncThunk("post/like", async (data) => {
  const response = await axios.patch(`/post/${data.postId}/like`);
  return response.data;
});

export const unlikePostRequest = createAsyncThunk(
  "/post/unlike",
  async (data) => {
    const response = await axios.delete(`/post/${data.postId}/like`);
    return response.data;
  }
);

export const uploadImages = createAsyncThunk(
  "/post/uploadImages",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.post("/post/images", data);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response);
    }
  }
);

export const retweet = createAsyncThunk(
  "/post/retweet",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.post(`/post/${data}/retweet`);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response);
    }
  }
);

export const submitImage = createAsyncThunk(
  "/post/submitImage",
  async (data, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await axios.post("/post/images", data);
      return fulfillWithValue(response.data);
    } catch (error) {
      throw rejectWithValue(error.response);
    }
  }
);
const submitReportThrottle = async (data) => {
  const response = await axios.post("/post/submitReport", data);
  return response.data;
};
export const submitReport = createAsyncThunk(
  "/post/submitReport",
  throttle(submitReportThrottle, 300000)
);
// const dummyPost = (data) => ({
//   id: data.id,
//   content: data.text,
//   User: {
//     id: 1,
//     nickname: "제로초",
//   },
//   Images: [],
//   Comments: [],
// });
//redux toolkit에는 기본적으로 immer가 적용이 되어진다 그래서 불변성을 안지키고 바로 값을 바꿀 수 있는
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // 비동기 액션이기 때문에 async를 설정안해도 된다
    removeImage(state, action) {
      state.imagePaths = state.imagePaths.filter(
        (v, i) => i !== action.payload
      );
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(HYDRATE, (state, action) => ({
        ...state,
        ...action.payload.post,
      }))
      .addCase(addPost.pending, (state, action) => {
        state.addPostLoading = true;
        state.addPostDone = false;
        state.addPostError = null;
      })
      .addCase(addPost.fulfilled, (state, action) => {
        // dispatch로 넘겨준 데이터는 action.payload에 저장된다
        console.log(action);
        state.mainPosts.unshift(action.payload);
        state.addPostLoading = false;
        state.addPostDone = true;
        state.imagePaths = [];
      })
      .addCase(addPost.rejected, (state, action) => {
        state.addPostLoading = false;
        state.addPostError = action.error;
      })
      //post를 지우는 action
      .addCase(removePost.pending, (state, action) => {
        console.log(action);
        state.addRemoveLoading = true;
        state.addRemoveDone = false;
        state.addRemoveError = null;
      })
      .addCase(removePost.fulfilled, (state, action) => {
        console.log(action);
        state.mainPosts = state.mainPosts.filter(
          (v) => v.id !== action.payload.PostId
        );
        state.addRemoveLoading = false;
        state.addRemoveDone = true;
      })
      .addCase(removePost.rejected, (state, action) => {
        console.log(action);
        state.addRemoveLoading = false;
        state.addRemoveError = action.error;
      })
      // 뎃글을 다는 action
      .addCase(addComment.pending, (state) => {
        state.addCommentLoading = true;
        state.addCommentDone = false;
        state.addCommentError = null;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        console.log(action);
        // 뎃글을 달 게시물을 찾는다
        const post = state.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        console.log("state", state, "post", post, "Comments", post.Coments);
        // 찾은 id로 mainPosts에서 id에 맞는 post를 찾는다
        post.Comments.unshift(action.payload);
        state.addCommentLoading = false;
        state.addCommentDone = true;
      })
      .addCase(addComment.rejected, (state, action) => {
        state.addCommentLoading = false;
        state.addCommentError = action.error;
      })
      // loadPosts 게시글 여러개
      .addCase(loadPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
      })
      .addCase(loadPosts.fulfilled, (state, action) => {
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
      })
      .addCase(loadPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      // loadPost 게시글 하나만
      .addCase(loadPost.pending, (state, action) => {
        state.loadPostLoading = true;
        state.loadPostDone = false;
      })
      .addCase(loadPost.fulfilled, (state, action) => {
        state.singlePost = action.payload;
        state.loadPostLoading = false;
        state.loadPostDone = true;
      })
      .addCase(loadPost.rejected, (state, action) => {
        console.log(action);
        state.loadPostLoading = false;
        state.loadPostError = action.error;
      })
      .addCase(loadUserPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadUserPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadUserPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addCase(loadHashtagPosts.pending, (state, action) => {
        state.loadPostsLoading = true;
        state.loadPostsDone = false;
        state.loadPostsError = null;
      })
      .addCase(loadHashtagPosts.fulfilled, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsDone = true;
        state.mainPosts = state.mainPosts.concat(action.payload);
        state.hasMorePosts = action.payload.length === 10;
      })
      .addCase(loadHashtagPosts.rejected, (state, action) => {
        state.loadPostsLoading = false;
        state.loadPostsError = action.error;
      })
      .addCase(likePostRequest.pending, (state, action) => {
        state.likePostLoading = true;
        state.likePostDone = false;
      })
      .addCase(likePostRequest.fulfilled, (state, action) => {
        const post = state.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Likers.push({ id: action.payload.UserId });
        state.likePostLoading = false;
        state.likePostDone = true;
      })
      .addCase(likePostRequest.rejected, (state, action) => {
        state.likePostLoading = false;
        state.likePostError = action.error;
      })
      .addCase(unlikePostRequest.pending, (state, action) => {
        state.unlikePostLoading = true;
        state.unlikePostDone = false;
      })
      .addCase(unlikePostRequest.fulfilled, (state, action) => {
        const post = state.mainPosts.find(
          (v) => v.id === action.payload.PostId
        );
        post.Likers = post.Likers.filter((v) => v.id !== action.payload.UserId);
        state.unlikePostLoading = false;
        state.unlikePostDone = true;
      })
      .addCase(unlikePostRequest.rejected, (state, action) => {
        state.unlikePostLoading = false;
        state.unlikePostError = action.payload.data;
      })
      .addCase(uploadImages.pending, (state, action) => {
        state.uploadImagesLoading = true;
        state.uploadImagesDone = false;
        state.uploadImagesError = null;
      })
      .addCase(uploadImages.fulfilled, (state, action) => {
        state.imagePaths = action.payload;
        state.uploadImagesLoading = false;
        state.uploadImagesDone = true;
      })
      .addCase(uploadImages.rejected, (state, action) => {
        state.uploadImagesLoading = false;
        state.uploadImagesError = action.payload.data;
      })
      .addCase(retweet.pending, (state, action) => {
        console.log(action);
        state.retweetLoading = true;
        state.retweetDone = false;
        state.retweetError = null;
      })
      .addCase(retweet.fulfilled, (state, action) => {
        console.log(action);
        state.retweetLoading = false;
        state.retweetDone = true;
        state.mainPosts.unshift(action.payload);
      })
      .addCase(retweet.rejected, (state, action) => {
        state.retweetLoading = false;
        state.retweetError = action.payload.data;
      })
      .addCase(submitImage.pending, (state, action) => {
        console.log(action);
        state.submitImageLoading = true;
        state.submitImageDone = false;
        state.submitImageError = null;
      })
      .addCase(submitImage.fulfilled, (state, action) => {
        console.log(action);
        state.submitImageLoading = false;
        state.submitImageDone = true;
        // state.mainPosts.unshift(action.payload);
      })
      .addCase(submitImage.rejected, (state, action) => {
        state.submitImageLoading = false;
        state.submitImageError = action.payload.data;
      })
      .addDefaultCase((state) => state),
});

// export default (state = initialState, action) => {
//   switch (action.type) {
//     case ADD_POST: {
//       return {
//         ...state,
//         mainPosts: [dummyPost, ...state.mainPosts],
//         postAdded: true,
//       };
//     }
//     default: {
//       return {
//         ...state,
//       };
//     }
//   }
// };
export default postSlice;
