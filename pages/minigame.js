import React, { useEffect, useState } from "react";
import Image from "next/image";
import Img from "../components/Img";
import ImageBack from "../components/ImageBack";
import Wallet from "../components/Wallet";
import Navbar from "../components/Navbar";
import Spacecraft from "../components/Spacecraft";
import Countdown from "../components/Countdown";
import ProgressBar from "../components/ProgressBar";
import Socials from "../components/Socials";
import styles from "../styles/Minigame.module.scss";

export default function Minigame() {
    const [navlist, setNavlist] = useState([
        {
            href: "/",
            data: "Home",
        },
        {
            href: "/#mission",
            data: "Mission",
        },
        {
            href: "/#roadmap",
            data: "Roadmap",
        },
        {
            href: "/minigame",
            data: "Faq",
        },
        {
            href: "/minigame",
            data: "My collection",
        },
    ]);

    const [address, setAddress] = useState("");
    const [account, setAccount] = useState(undefined);
    const [startTime, setStartTime] = useState(Date.now());
    const [endTime, setEndTime] = useState(Date.now() + 30000);

    return (
        <div className={styles.minigame}>
            <header>
                <Navbar navs={navlist} className={styles.mainNav} />
                <Wallet address={address} onClick={() => {}} />
            </header>
            <main>
                <Spacecraft
                    width={60}
                    className={styles.spacecraft}
                    startTime={startTime}
                    endTime={endTime}
                />
                <Img
                    src="/images/m_star.png"
                    className={styles.star}
                    alt="star"
                    layout="fill"
                />
                <p className={styles.flightcap}>flight to earth</p>
                <Img
                    src="/images/earth.png"
                    className={styles.earth}
                    alt="earth"
                    layout="fill"
                />
                <Countdown endTime={endTime} className={styles.timer} />
                <ProgressBar
                    startTime={startTime}
                    endTime={endTime}
                    className={styles.progressbar}
                />
                <span
                    className={styles.cat}
                    onClick={() => {
                        alert("send token text");
                    }}
                ></span>
                <div className={styles.light}></div>
                <p className={styles.sendcap}>
                    Send Stardrust to your partner (Click Cat to pop-up send
                    token box)
                </p>
                <Img
                    src="/images/supply.png"
                    className={styles.supply}
                    onClick={() => {
                        alert("supply");
                    }}
                />
                <Img
                    src="/images/spaceship.png"
                    className={styles.discord}
                    onClick={() => {
                        alert("join discord");
                    }}
                />
                <div className={styles.tab}>
                    <Image src="/images/tab.png" alt="tab" layout="fill" />
                    <p>
                        Your total supply : <span>168</span> SD
                    </p>
                    <span
                        onClick={() => {
                            alert("Claim White list");
                        }}
                    >
                        Claim White List
                    </span>
                </div>
            </main>
            <footer>
                <Socials className={styles.socials} />
                <p>
                    Follow the Feliz Mission on Twitter, Discord &#38; Instagram
                </p>
            </footer>
        </div>
    );
}
