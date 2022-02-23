import react, { useState, useEffect } from "react";
import Image from "next/image";
import Img from "./Img";
import styles from "./ProgressBar.module.scss";

export default function ProgressBar({ startTime, endTime, className }) {
    const [progress, setProgress] = useState(1);
    useEffect(() => {
        const timerId = setInterval(() => {
            if (now > endTime) {
                clearInterval(timerId);
                setProgress(1);
                return;
            }
            const now = Date.now();
            setProgress(100 - ((now - startTime) / (endTime - startTime)) * 99);
        }, 1000);
    }, []);
    return (
        <div className={styles.ProgressBar + " " + className}>
            <div className={styles.container}>
                <div
                    className={styles.filler}
                    style={{ width: `${progress}%` }}
                >
                    <Img
                        src="/images/fish.png"
                        alt="cursor"
                        className={styles.cursor}
                    />
                </div>
            </div>
        </div>
    );
}
