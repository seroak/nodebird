import React from "react";
import styles from "./App.module.css";
import { Jua } from "next/font/google";
const jua = Jua({
  weight: "400",
  subsets: ["latin"],
});
const App = () => {
  const title = [
    ["음악", "퀴즈"],
    ["사자", "성어"],
    ["이어", "말하기"],
    ["인물", "퀴즈"],
    ["수도", "퀴즈"],
  ];
  return (
    <main className={jua.className}>
      <div className="body">
        <div className={styles.status}>
          <div className={styles.status_box1}>
            <span>예능 게임 모음</span>
          </div>
          <div className={styles.status_box2}>
            <span>누워서 볼땐 쉬어보엿지?</span>
          </div>
        </div>

        <div className={styles.mid}>
          <span>걸그룹 스무고개 도전하기</span>
        </div>
        <div className={styles.main}>
          <div className={styles.main_title}>
            <span>도전</span>
          </div>

          <div className={styles.category}>
            {title.map((titleElem, index) => {
              return (
                <div key={index}>
                  {index === 2 ? (
                    <div className={styles.box1}>
                      <span>{titleElem[0]}</span>
                      <span>{titleElem[1]}</span>
                    </div>
                  ) : (
                    <div className={styles.box}>
                      <span>{titleElem[0]}</span>

                      <span>{titleElem[1]}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
