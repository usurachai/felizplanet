import React from "react";
import Image from "next/image";
import styles from "./Statusbar.module.scss";

export default function Statusbar({ startTime, endTime }) {
    return <div className={styles.Statusbar}>{/* <Image src={}/> */}</div>;
}
