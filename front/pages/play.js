import React, { useState, useRef, useEffect } from "react";
import styles from "./Play.module.css";
import { Jua } from "next/font/google";
const jua = Jua({
  weight: "400",
  subsets: ["latin"],
});

const Play = () => {
  const [change, setChange] = useState(false);
  const [countdown, setCountdown] = useState(3);
  //게임 시작을 알리는 변수
  const [game, setGame] = useState(false);
  // 리셋버튼을 보이게 하는 변수
  const [visible, setVisible] = useState(false);
  // 몇초 동안 맞출 시간을 줄지
  const [Selected, setSelected] = useState(3);
  // 게임 중인걸 표시하는 변수
  const [running, setRunning] = useState(false);
  // 맞추는 시간 보이게하는 변수
  const [countvisible, setCountvisible] = useState(false);
  // 문제 맞추는 카운트 다운
  const [countdown2, setCountdown2] = useState(Selected);

  const handleSelect = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    setCountdown2(Selected);
  }, [Selected]);

  // 사람이름 맞추는 카운트
  useEffect(() => {
    if (running === false) {
      return;
    }
    const countdownInterval = setInterval(() => {
      setCountdown2((prevCountdown) => prevCountdown - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(countdownInterval);
      setRunning(false);
      setVisible(true);
      console.log("게임종료");
    }, 3000);
  }, [running]);

  const reset = () => {
    setChange(false);
    setCountdown(3);
    setGame(false);
    setVisible(false);
  };
  const gameStart = () => {
    setChange(true);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);
    setTimeout(() => {
      clearInterval(countdownInterval);
      setGame(true);
      setCountvisible(true);
      setRunning(true);
      setCountdown(Selected);
      console.log("카운트");
    }, 3000);
    console.log("hi");
  };
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
          <div className={styles.mainbox}>
            <p className={styles.main_title}>인물 퀴즈</p>
            <div className={styles.limit}>
              제한시간은
              <select name="time" onChange={handleSelect} value={Selected}>
                <option value="3초">3초</option>
                <option value="4초">4초</option>
                <option value="5초">5초</option>
                <option value="6초">6초</option>
                <option value="7초">7초</option>
              </select>
              입니다
            </div>
          </div>
          <div className={styles.control}>
            <div className={styles.picture}>
              {change === true ? (
                game === true ? (
                  <img className={styles.img} src="./카리나.png" />
                ) : (
                  <div className={styles.number}>{countdown}</div>
                )
              ) : (
                <img className={styles.img} src="./기본.png" />
              )}
            </div>
            <div className={styles.container}>
              <button className={styles.start} onClick={gameStart}>
                시작
              </button>
              {visible && (
                <button className={styles.start} onClick={reset}>
                  리셋
                </button>
              )}
              {countvisible &&
                (countdown2 === 0 ? (
                  <div>틀렸습니다 ㅠㅠ</div>
                ) : (
                  <div className={styles.number}>{countdown2}</div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Play;
