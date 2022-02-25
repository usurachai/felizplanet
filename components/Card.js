import Image from "next/image";
import styles from "./Card.module.scss";

export default function Card({ className, url, key }) {
    return (
        <div
            key={"styles.Card" + key}
            className={styles.Card + " " + className}
        >
            <Image
                src="/images/Card.png"
                alt={"NFT background"}
                layout="fill"
                className={styles.background}
            />
            <div className={styles.img}>
                <Image src={url} alt={"NFT image"} layout="fill" />
            </div>
        </div>
    );
}
