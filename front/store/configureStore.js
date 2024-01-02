import { configureStore } from "@reduxjs/toolkit";
import { createWrapper } from "next-redux-wrapper";
import reducer from "../reducers";

function getServerState() {
  return typeof document !== "undefined"
    ? JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
        .pageProps.initialState
    : undefined;
}
const serverState = getServerState();
console.log("serverState", serverState);
const makeStore = () =>
  configureStore({
    reducer,
    devTools: true,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    preloadedState: serverState, // SSR
  });
const wrapper = createWrapper(makeStore);
export default wrapper;

// import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";
// import { createWrapper } from "next-redux-wrapper";
// import reducer from "../reducers";
// const listenerMiddleware = createListenerMiddleware();
// function getServerState() {
//   return typeof document !== "undefined"
//     ? JSON.parse(document.querySelector("#__NEXT_DATA__").textContent)?.props
//         .pageProps.initialState
//     : undefined;
// }
// const serverState = getServerState();
// console.log("serverState", serverState);
// const makeStore = () =>
//   configureStore({
//     reducer,
//     devTools: true,
//     middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware({ serializableCheck: false }).prepend(
//         listenerMiddleware.middleware
//       ),
//     preloadedState: serverState, // SSR
//   });

// export default createWrapper(makeStore);
