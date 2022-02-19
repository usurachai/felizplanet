import React, { useEffect, useState, ReactElement } from "react";
import styles from "../styles/Home.module.scss";
import ImageLink from "../components/ImageLink";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
// import { useMoralis } from "react-moralis";
import Web3 from "web3";
import { ethers } from "ethers";
import { FELIZ_CITIZENS, FELIZ_STARDRUST } from "../utils/enum/token";

import Img from "../components/Img";

import ImageBack from "../components/ImageBack";
import MintCard from "../components/MintCard";

// import img_ship from '../public/images/m_ship.png'
// import img_basket from '../public/images/m_basket.png'
import Navbar from "../components/Navbar";

import FelizCitizenAbi from "../contracts/artifacts/FelizCitizen.json";
import StardustCaskAbi from "../contracts/artifacts/StardustCask.json";
import contractAddress from "../contractAddress.json";
import { MINT, MINT_COMMING, MINT_PRESALE } from "../utils/enum/mint";
import mintDate from "../utils/test/mintDate";
import dateFormatter from "../utils/dateFormatter";

export default function Home() {
    const checkWalletIsConnected = async () => {
        const { ethereum } = window;

        console.log(ethereum);
        if (!ethereum) {
            console.log("Make sure you have Metamask installed!");
        } else {
            console.log("Wallet exists! We're ready to go");
        }

        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        });

        if (accounts.length !== 0) {
            const account = accounts[0];
            console.log("Found an authorized account: ", account);
            setAccount(account);
        }
    };

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            alert("Please install Metamask");
        }

        try {
            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            console.log("Found an account! Address: ", accounts[0]);
            setAccount(accounts[0]);
        } catch (err) {}
    };

    const mintNftHandler = () => {};

    // const mintCitizenHandler = async () => {
    //   try {
    //     const { ethereum } = window;

    //     if (ethereum) {
    //       const provider = new ethers.providers.Web3Provider(ethereum)
    //       const signer = provider.getSigner()
    //       const nftContract = new ethers.Contract(contractAddress.FelizCitizen, FelizCitizenAbi)
    //       let nft
    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }

    useEffect(() => {
        checkWalletIsConnected();
        const interval = setInterval(() => {
            const todate = mintDate - Date.now();
            // console.log(mintDate, Date.now(), mintDate - Date.now())
            if (todate <= 0) {
                setCountdown(dateFormatter(0));
                clearInterval(interval);
            }
            setCountdown(dateFormatter(todate));
            // console.log(typeof todate)
            // console.log(dateFormatter(todate))
            // console.log((new Date()) - mintDate)
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    // const [toMint, setToMint] = useState((new Date()) - mintDate)

    const [navlst, setNavlst] = useState([
        {
            href: "/",
            data: "Home",
        },
        {
            href: "/#mission",
            data: "Mission",
        },
        {
            href: "/",
            data: "Roadmap",
        },
        {
            href: "/",
            data: "Partner",
        },
        {
            href: "/",
            data: "WhilePaper",
        },
    ]);

    const [account, setAccount] = useState("");
    const [countdown, setCountdown] = useState("00:00:00:00");

    const [cardList, setCardList] = useState([
        {
            src: "/images/token.png",
            type: FELIZ_CITIZENS,
        },
        {
            src: "/images/fish.png",
            type: FELIZ_STARDRUST,
        },
        {
            src: "/images/meteor.png",
            type: FELIZ_STARDRUST,
        },
    ]);
    const [index, setIndex] = useState(0);

    // Card slide show
    const slideLeft = () => {
        setIndex((index - 1 + cardList.length) % cardList.length);
    };

    const slideRight = () => {
        setIndex((index + 1) % cardList.length);
    };

    const walletDom = (account) => {
        if (!account) {
            return (
                <ImageBack
                    src="/images/m_wallet.png"
                    className={styles.walletoff}
                    text="Connect wallet"
                    onClick={connectWalletHandler}
                />
            );
        } else {
            return (
                <ImageBack
                    src="/images/m_wallet.png"
                    className={styles.walleton}
                    text={account}
                />
            );
        }
    };

    let posX = -1;

    const onMouseDown = (e) => {
        // console.log(e)
        posX = e.clientX;
    };

    const onMouseUp = (e) => {
        // console.log(posX - e.clientX)
        const delta = e.clientX - posX;
        console.log("delta", delta);
        if (delta > 0) slideLeft();
        else if (delta < 0) slideRight();
    };

    const onTouchStart = (e) => {
        // console.log("onTouchStart", e)
        posX = e.touches[0].clientX;
        // console.log("posX", posX)
    };

    const onTouchEnd = (e) => {
        const delta = e.changedTouches[0].clientX - posX;
        // console.log("onTouchEnd", e)
        console.log("delta", delta);
        // console.log()
        if (delta > 0) slideLeft();
        else if (delta < 0) slideRight();
    };

    return (
        <>
            {/* <div className={styles.background}> */}
            <header className={styles.main}>
                {/* <motion.div 
          animate={{
            x: '20vw'
          }}
          transition={{
            type: 'tween',
            duration: 2
          }}
        >
          Weeee I'm animated
      </motion.div> */}
                <Navbar navs={navlst} className={styles.mainNav} />

                {walletDom(account)}

                <h3 className={styles.info}>
                    8,700 Citizens NFT is coming soon
                </h3>
                <Link href="#mission">
                    <a className={styles.mint}>MINT</a>
                </Link>
                <ImageLink
                    src="/images/logo.png  "
                    href="/"
                    className={styles.logo}
                />
                <ImageBack
                    src="/images/m_countdown.png"
                    className={styles.countdown}
                    text={countdown}
                />
                <Img
                    src="/images/m_ship.png"
                    className={styles.ship}
                    alt="ship"
                    layout="fill"
                />
                <ImageLink
                    src="/images/m_basket.png"
                    href="/minigame"
                    className={styles.basket}
                />
                <Link href="/">
                    <a className={styles.island_discord}></a>
                </Link>
                <ImageLink
                    src="/images/m_opensea.png"
                    href="/"
                    className={styles.opensea}
                />
            </header>
            <main>
                <section className={styles.story}>
                    <article>
                        <h2>The Feliz Story</h2>
                    </article>
                    <Img src="/images/fish.png" className={styles.fish1} />
                    <Img src="/images/fish.png" className={styles.fish2} />
                    <Img src="/images/fish.png" className={styles.fish3} />
                    <Img src="/images/fish.png" className={styles.fish4} />
                    <Img src="/images/fish.png" className={styles.fish5} />
                    <Img src="/images/meteor.png" className={styles.meteor} />
                </section>

                <section className={styles.mission} id="mission">
                    <h2>Our Missinos</h2>
                    <section
                        className={styles.citizen}
                        onMouseUp={onMouseUp}
                        onMouseDown={onMouseDown}
                        onTouchStart={onTouchStart}
                        onTouchEnd={onTouchEnd}
                        // onDrag
                    >
                        {/* <motion.div
                initial={{ x: '100px'}}
                animate={{ y: '100px'}}
                exit={{ opacity: 0 }}
              > */}
                        {/* <button onClick={slideLeft}>prev</button>
              <button onClick={slideRight}>next</button> */}
                        {cardList.map((card, idx) => {
                            // console.log(index)
                            let className = "";
                            if (
                                idx ===
                                (index - 1 + cardList.length) % cardList.length
                            )
                                className = styles.mintCardprev;
                            else if (idx === index)
                                className = styles.mintCardmain;
                            else if (idx === (index + 1) % cardList.length)
                                className = styles.mintCardnext;
                            return (
                                <MintCard
                                    key={"card-" + idx}
                                    src={card.src}
                                    alt="test"
                                    className={className}
                                    account={account}
                                    type={card.type}
                                    countdown={countdown}
                                />
                            );
                        })}
                    </section>
                    <section className={styles.stardrust}>
                        <h3 className={styles.dashboard}>Dashboard</h3>
                        <Link href="/dashboard">
                            <a className={styles.door}></a>
                        </Link>
                        <ImageLink
                            href="/"
                            src="/images/mimi screen1.png"
                            className={styles.miniscreen1}
                            text="Discord"
                        />
                        <ImageLink
                            href="/"
                            src="/images/mimi screen2.png"
                            className={styles.miniscreen2}
                            text="Twitter"
                        />
                        <ImageLink
                            href="/"
                            src="/images/mimi screen3.png"
                            className={styles.miniscreen3}
                            text="Whitepaper"
                        />
                        <ImageLink
                            href="/"
                            src="/images/mimi screen4.png"
                            className={styles.miniscreen4}
                            text="Opensea"
                        />
                    </section>
                </section>
                <section className={styles.roadmap}>
                    <header>
                        <h2>Q1-Q2 Road Map</h2>
                        <p>
                            The Felis are still traveling. They had a great time
                            harvesting. And they always share these good times
                            with their friends.
                        </p>
                    </header>
                    <main>
                        <Img src="/images/road.png" className={styles.road} />
                        <aside className={styles.roadpoint1}>
                            <h4>Feliz flight to the earth</h4>
                            <p>-Giveaway 2 citiaen NFTs</p>
                            <p>& WL begin</p>
                            <Img
                                src="/images/road_point.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint2}>
                            <h4>Stardrust casks</h4>
                            <h4>project launch</h4>
                            <Img
                                src="/images/road_point.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint3}>
                            <h4>Feliz HQ launch</h4>
                            <p>- Airdrop suprises for the community.</p>
                            <Img
                                src="/images/road_point.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint4}>
                            <h4>Feliz citizen launch</h4>
                            <p>- Mini game for WL begins.</p>
                            <p>& WL begin</p>
                            <Img
                                src="/images/road_point.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint5}>
                            <h4>Donation of 3 ETH</h4>
                            <p>to a chartiable Organization</p>
                            <p>after 1,000 NFTs Sold</p>
                            <Img
                                src="/images/road_point.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint6}>
                            <h4>Upgrade feliz HQ</h4>
                            <p>For support $Pearl.</p>
                            <p>& WL begin</p>
                            <Img
                                src="/images/road_point_off.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint7}>
                            <h4>Start feliz</h4>
                            <h4>initial project.</h4>
                            <Img
                                src="/images/road_point_off.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint8}>
                            <h4>Consider buying NFT</h4>
                            <h4>World land</h4>
                            <p>For feliz game in the future.</p>
                            <Img
                                src="/images/road_point_off.png"
                                className={styles.point}
                            />
                        </aside>
                        <aside className={styles.roadpoint9}>
                            <h4>DAO Start!</h4>
                            <p>Real estate</p>
                            <Img
                                src="/images/road_point_off.png"
                                className={styles.point}
                            />
                        </aside>
                    </main>
                </section>
            </main>
            <footer className={styles.partner}>
                <h2>Partner</h2>
                <div className={styles.socials}>
                    <Img
                        src="/images/social/discord.png"
                        className={styles.socialIcon1}
                    />
                    <Img
                        src="/images/social/opensea.png"
                        className={styles.socialIcon2}
                    />
                    <Img
                        src="/images/social/twitter.png"
                        className={styles.socialIcon3}
                    />
                </div>
                <Link href="/">
                    <a>Terms and conditions</a>
                </Link>
                {/* <h3></h3> */}
            </footer>
            {/* </div> */}
        </>
    );
}
