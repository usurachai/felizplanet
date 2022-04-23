import React from "react";
import styles from "./Team.module.scss";
import Image from "next/image";

export default function Team({ name, title, photo }) {
    return (
        // <div className={styles.teams}>
        //     <div className={styles.profileimage}>
        //         <Image alt={name} src={photo} layout="fill" objectFit="cover" />
        //     </div>
        //     <div className={styles.profilename}>
        //         <h4>{name}</h4>
        //     </div>
        //     <div className={styles.profiletitle}>
        //         <h4>{title}</h4>
        //     </div>
        // </div>

        <div className="flex-1">
            <h4 className="text-gray-100 font-patron text-center text-1_3vw">
                {name}
            </h4>
            <img alt={name} src={photo} className="object-cover h-20vw" />
            <h4 className="text-gray-100 font-patron text-center text-1_3vw">
                {title}
            </h4>
        </div>
    );
}
