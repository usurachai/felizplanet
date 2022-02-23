import React, { useEffect, useState, ReactElement } from "react";
import styles from "../styles/Home.module.scss";
import ImageLink from "../components/ImageLink";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
// import { useMoralis } from "react-moralis";
import Web3 from "web3";
import { ethers } from "ethers";

import {
    FELIZ_CITIZENS,
    FELIZ_STARDRUST_SILVER,
    FELIZ_STARDRUST_GOLD,
} from "../utils/enum/token";

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
import Modal, { SUCCESS, LOADING, FAILED } from "../components/Modal";
import PopUp from "../components/PopUp";

import Wallet from "../components/Wallet";
import errorFilter from "../utils/errorFilter";

export default function Home() {
    const router = useRouter();
    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        // console.log(ethereum.chainId, typeof ethereum.chainId)
        if (ethereum) {
            // detect Metamask account change
            window.ethereum.on("accountsChanged", function (accounts) {
                setAccount(undefined);
                setAddress("");
            });

            // detect Network account change
            window.ethereum.on("networkChanged", function (networkId) {
                console.log(
                    "networkChanged",
                    networkId,
                    typeof networkId,
                    networkId !== "4"
                );
                if (networkId !== "4") {
                    alert("Wrong network");
                    setAccount(undefined);
                    setAddress("");
                }
            });
        }

        if (!ethereum) {
            // alert('Please install Metamask')
            setAccount(undefined);
            setAddress("");
        } else if (ethereum.chainId !== "0x4") {
            // alert("Change network to Rinkeby network.")
            setAccount(undefined);
            setAddress("");
        } else {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = await provider.getSigner();
                setAccount(signer);
                setAddress(await signer.getAddress());
            } catch (err) {}
        }
    };

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        // console.log(ethereum.chainId, typeof ethereum.chainId)
        if (!ethereum) {
            alert("Please install Metamask");
        } else if (ethereum.chainId !== "0x4") {
            alert("Change network to Rinkeby network.");
        } else {
            try {
                // if (ethereum.accounts.length === 0) alert('Please login metamask')
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = await provider.getSigner();
                console.log("signer", signer);
                setAccount(signer);
                setAddress(await signer.getAddress());
            } catch (err) {
                console.log(err);
                alert(errorFilter(err));
            }
        }
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
            } else {
                setCountdown(dateFormatter(todate));
            }
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
            href: "#home",
            data: "Home",
        },
        {
            href: "#mission",
            data: "Mission",
        },
        {
            href: "#roadmap",
            data: "Roadmap",
        },
        {
            href: "#partner",
            data: "Partner",
        },
        {
            href: "/",
            data: "WhilePaper",
        },
    ]);

    const [account, setAccount] = useState(undefined);
    const [address, setAddress] = useState("");
    const [countdown, setCountdown] = useState("00:00:00:00");

    const [cardList, setCardList] = useState([
        {
            src: "/images/token.png",
            type: FELIZ_CITIZENS,
        },
        {
            src: "/images/fish.png",
            type: FELIZ_STARDRUST_SILVER,
        },
        {
            src: "/images/meteor.png",
            type: FELIZ_STARDRUST_GOLD,
        },
    ]);
    const [index, setIndex] = useState(0);

    const [popupText, setPopupText] = useState("");
    const [popupNum, setPopupNum] = useState(0);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [modalType, setModalType] = useState(undefined);
    const [modalNum, setModalNum] = useState(0);

    // Card slide show
    const slideLeft = () => {
        setIndex((index - 1 + cardList.length) % cardList.length);
    };

    const slideRight = () => {
        setIndex((index + 1) % cardList.length);
    };

    const walletDom = (address) => {
        if (!address) {
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
                    text={address}
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

    const alert = (text) => {
        setPopupText(text);
        setPopupNum((prev) => prev + 1);
    };

    const modal = (title, content, type) => {
        setModalTitle(title);
        setModalContent(content);
        setModalType(type);
        setModalNum((prev) => prev + 1);
    };

    const clickDoor = (signer) => () => {};

    // const clickDoor = (account) = async () => {
    //   try {
    //     const { ethereum } = window
    //     if (ethereum) {
    //       // const contract = new Web3
    //       const provider = new ethers.providers.Web3Provider(ethereum)
    //       const citizenContract = new ethers.Contract(contractAddress.StardustCask, stardrustAbi.abi, account)
    //       const caskContract = new ethers.Contract(contractAddress.StardustCask, stardrustAbi.abi, account)

    //       const address = await account.address();
    //       const citizen = citizenContract.addressMintedBalance(address)
    //       // const gold =
    //       // // cost
    //       // const cost = await nftContract.getGoldenCasksCost()
    //       // console.log("Gold cost: ", ethers.utils.formatUnits(cost, 'ether'))
    //       // setCost(Math.round(ethers.utils.formatUnits(cost, 'ether') * 10000) / 10000 )

    //       // // Max CASK
    //       // const MaxCasksPerAddress = await nftContract.MaxCasksPerAddress()
    //       // setMaxSupply(MaxCasksPerAddress.toNumber())
    //       // console.log("MaxCasksPerAddress: ", MaxCasksPerAddress.toNumber())

    //       // // Minted CASKs
    //       // const totalGoldCasks = await nftContract.getTotalGoldenCasks()
    //       // setTotalSupply(totalGoldCasks.toNumber())
    //       // console.log("totalGoldCasks: ", totalGoldCasks.toNumber())

    //       // // Limit
    //       // setLimit(MaxCasksPerAddress.toNumber() -totalGoldCasks.toNumber())
    //       if (citizen.toNumber() > 0) {
    //         router.push('/dashboard')
    //       } else {
    //         alert('You are not feliz citizens')
    //       }

    //     }
    //   } catch (err) {
    //     console.log(err)
    //   }
    // }

    return (
        <>
            <Modal
                title={modalTitle}
                content={modalContent}
                type={modalType}
                num={modalNum}
            />
            {popupText && (
                <PopUp timeout={3000} text={popupText} num={popupNum} />
            )}
            <header className={styles.main}>
                <Navbar navs={navlst} className={styles.mainNav} />

                {/* {walletDom(address)} */}
                <Wallet address={address} onClick={connectWalletHandler} />

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
                <Link href="https://discord.com/">
                    <a className={styles.island_discord}></a>
                </Link>
                <ImageLink
                    src="/images/m_opensea.png"
                    href="/"
                    className={styles.opensea}
                />
            </header>

            <main>
                <section className={styles.story} id="story">
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
                            console.log("card-", card.type);
                            return (
                                <MintCard
                                    key={"card-" + idx}
                                    src={card.src}
                                    alt="test"
                                    className={className}
                                    account={account}
                                    type={card.type}
                                    countdown={countdown}
                                    alert={alert}
                                    modal={modal}
                                />
                            );
                        })}
                    </section>

                    <section className={styles.stardrust}>
                        <h3 className={styles.dashboard}>FELIZ HQ</h3>
                        <div
                            className={styles.door}
                            onClick={clickDoor(account)}
                        ></div>
                        {/* <Link href='/dashboard'><a className={styles.door}></a></Link> */}
                        <ImageLink
                            href="https://discord.com/"
                            src="/images/mimi screen1.png"
                            className={styles.miniscreen1}
                            text="Discord"
                        />
                        <ImageLink
                            href="https://twitter.com/"
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
                            href="https://opensea.io/"
                            src="/images/mimi screen4.png"
                            className={styles.miniscreen4}
                            text="Opensea"
                        />
                    </section>
                </section>

                <section className={styles.roadmap} id="roadmap">
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

            <footer className={styles.partner} id="partner">
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
