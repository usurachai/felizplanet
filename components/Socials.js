/* eslint-disable react/jsx-key */
import ImageLink from "./ImageLink";
import Img from "./Img";
import styles from "./Socials.module.scss";

export default function Socials({ className }) {
    return (
        <div className={styles.Socials + " " + className}>
            <ImageLink
                src="/images/social/discord.png"
                href=" https://discord.gg/qvN3ZC6DvB"
                className={styles.socialIcon1}
            />
            <ImageLink
                src="/images/social/opensea.png"
                href="https://opensea.io/"
                className={styles.socialIcon2}
            />
            <ImageLink
                src="/images/social/twitter.png"
                href="https://twitter.com/FelizPlanet"
                className={styles.socialIcon3}
            />
        </div>
    );
}
