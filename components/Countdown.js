import React, { useState, useEffect } from "react";
import styles from "./Countdown.module.scss";

function padZero(num) {
    let ret = "000";
    if (num && typeof num === "number") {
        const snum = num.toString();
        ret = snum.padStart(3, "0");
    }
    return ret;
}

export default function Countdown({ endTime, className }) {
    const [day, setDay] = useState(1);
    const [hour, setHour] = useState(1);
    const [min, setMin] = useState(1);
    const [sec, setSec] = useState(1);

    useState(() => {
        const timer = setInterval(() => {
            const toTime = endTime - Date.now();
            if (toTime <= 0) {
                clearInterval(timer);
                return;
            }
            let tmp = Math.floor(toTime / 1000);
            setSec(tmp % 60);
            tmp = Math.floor(tmp / 60);
            setMin(tmp % 60);
            tmp = Math.floor(tmp / 60);
            setHour(tmp % 24);
            setDay(Math.floor(tmp / 24));
        });

        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div className={styles.Countdown + " " + className}>
            <span className={styles.day}>{padZero(day)}</span>
            <p className={styles.day}>day</p>
            <span className={styles.hour}>{padZero(hour)}</span>
            <p className={styles.hour}>hour</p>
            <span className={styles.min}>{padZero(min)}</span>
            <p className={styles.min}>minute</p>
            <span className={styles.sec}>{padZero(sec)}</span>
            <p className={styles.sec}>second</p>
        </div>
    );
}
