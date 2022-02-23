import react, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Spacecraft.module.scss";
import Img from "./Img";

export default function Spacecraft({ width, startTime, endTime, className }) {
    const path = {
        start: { x: -0.1 * width, y: 0, angle: -45 },
        middle: { x: 0.35 * width, y: 0.17 * width, angle: 0 },
        end: { x: 0.8 * width, y: 0, angle: 45 },
    };

    const [craft, setCraft] = useState({
        left: `${path.start.x}vw`,
        bottom: `${path.start.y}vw`,
        transform: `rotate(${path.start.angle}deg)`,
    });

    // const [craft, setCraft] = useState({
    //   left: `${path.middle.x}vw`,
    //   bottom: `${path.middle.y}vw`,
    //   transform: `rotate(${path.middle.angle}deg)`
    // })

    // const [craft, setCraft] = useState({
    //   left: `${path.end.x}vw`,
    //   bottom: `${path.end.y}vw`,
    //   transform: `rotate(${path.end.angle}deg)`
    // })

    const setCraftStyle = (x, y, angle) => {
        setCraft({
            left: `${x}vw`,
            bottom: `${y}vw`,
            transform: `rotate(${angle}deg)`,
        });
    };

    const updateXYD = (startTime, endTime, R, H, X, dAngle) => {
        const now = Date.now();
        if (now > endTime) {
            return;
        }
        let progress = (now - startTime) / (endTime - startTime);
        let x = X * progress + path.start.x;
        let dx = X * progress - X / 2;
        const y = Math.sqrt(R * R - Math.pow(dx, 2)) - (R - H);
        const angle = dAngle * (1 - progress * 2);
        console.log("angle", angle);
        setCraftStyle(x, y, angle);
    };

    useEffect(() => {
        const X = path.end.x - path.start.x;
        const halfX = X / 2;
        const H = path.middle.y - path.start.y;
        const R = (Math.pow(halfX, 2) + Math.pow(H, 2)) / (2 * H);
        const dAngle = path.start.angle - path.middle.angle;

        const timer = setInterval(() => {
            const now = Date.now();
            if (now > endTime) {
                clearInterval(timer);
            } else {
                updateXYD(startTime, endTime, R, H, X, dAngle);
            }
        }, 1000);
        return () => {
            clearInterval(timer);
        };
    }, []);

    return (
        <div
            className={className + " " + styles.Spacecraft}
            style={{
                width: `${width}vw`,
                height: `${width * 0.25}vw`,
            }}
        >
            {/* <div> */}
            <Image src="/images/mark.png" alt="spaceship" layout="fill" />
            {/* </div> */}
            <Img
                src="/images/spacecraft.png"
                className={styles.craft}
                style={craft}
            />
            {/* <Image src='/images/' alt/> */}
        </div>
    );
}
