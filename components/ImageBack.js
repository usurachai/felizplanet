import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./ImageBack.module.scss";

export default function ImageBack({
    className,
    src,
    alt,
    href,
    text,
    onClick,
}) {
    return (
        <div className={styles.ImageBack + " " + className} onClick={onClick}>
            {/* {console.log(styles.ImageBack)} */}
            <h3>
                {text}
                {/* --:--:--:-- */}
            </h3>
            <Image src={src} alt={alt} layout="fill" />
        </div>
    );
}
