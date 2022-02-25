import React, { useEffect, useState } from "react";
import styles from "../styles/dashboard.module.scss";
import Img from "../components/Img";
import Link from "next/link";
import Card from "../components/Card";
import { useRouter } from "next/router";
import { ethers } from "ethers";

// import { getContractAddress } from 'ethers/lib/utils'
import contractAddress from "../contractAddress.json";
import citizenAbi from "../contracts/artifacts/FelizCitizen.json";
import stardrustAbi from "../contracts/artifacts/StardustCask.json";
import erc20Abi from "../contracts/artifacts/IERC20.json";
import { SC_ID_GOLD, SC_ID_SILVER, SC_ID_BRONZ } from "../utils/enum/scnftType";

const OVERVIEW = "OVERVIEW";
const CITIZEN = "CITIZEN";
const ASSETS = "ASSETS";
const REWARDS = "REWARDS";
const EVENTS = "EVENTS";

export default function Dashboard() {
    const route = useRouter();
    const [account, setAccount] = useState(undefined);

    function redirectHome(error) {
        console.log(error);
        // route.push('/', undefined, {scroll: false})
    }
    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        // console.log(ethereum.chainId, typeof ethereum.chainId)
        if (ethereum) {
            // detect Metamask account change
            window.ethereum.on("accountsChanged", function (accounts) {
                connectWalletHandler();
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
                    redirectHome("wrong network ID");
                }
            });
        }

        if (!ethereum) {
            redirectHome("Metamasl errpr");
        } else if (ethereum.chainId !== "0x4") {
            redirectHome("wrong network ID");
        } else {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = await provider.getSigner();
                accountUpdate(signer);
            } catch (err) {
                redirectHome(err);
            }
        }
    };

    const connectWalletHandler = async () => {
        const { ethereum } = window;

        // console.log(ethereum.chainId, typeof ethereum.chainId)
        if (!ethereum) {
            redirectHome("Metamask error");
        } else if (ethereum.chainId !== "0x4") {
            redirectHome("wrong network ID");
        } else {
            try {
                // if (ethereum.accounts.length === 0) alert('Please login metamask')
                const provider = new ethers.providers.Web3Provider(ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                console.log("signer", signer);
                accountUpdate(signer);
            } catch (err) {
                console.log(err);
                redirectHome(err);
            }
        }
    };

    function accountUpdate(account) {
        getBalances(account);
        setAccount(account);
    }

    // Get balances of the tokens which account own.
    const getBalances = async (signer) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // Owned Citizen tokens
                const citizenContract = new ethers.Contract(
                    contractAddress.FelizCitizen,
                    citizenAbi.abi,
                    signer
                );
                const citizen = (
                    await citizenContract.balanceOf(signer.getAddress())
                ).toNumber();
                console.log("citizen balance: ", citizen);
                setCitizenNum(citizen);
                // Owned Stardust tokens
                const stardustContract = new ethers.Contract(
                    contractAddress.StardustCask,
                    stardrustAbi.abi,
                    signer
                );
                let totalCasks = (
                    await stardustContract.balanceOf(
                        signer.getAddress(),
                        SC_ID_GOLD
                    )
                ).toNumber();
                totalCasks += (
                    await stardustContract.balanceOf(
                        signer.getAddress(),
                        SC_ID_SILVER
                    )
                ).toNumber();
                totalCasks += (
                    await stardustContract.balanceOf(
                        signer.getAddress(),
                        SC_ID_BRONZ
                    )
                ).toNumber();
                console.log("stardust balance: ", totalCasks);
                setCasksNum(totalCasks);
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const [active, setActive] = useState(OVERVIEW);
    const [citizenNum, setCitizenNum] = useState(0);
    const [casksNum, setCasksNum] = useState(0);
    const [citizens, setCitizens] = useState([
        "/images/fish.png",
        "/images/fish.png",
        "/images/fish.png",
        "/images/fish.png",
        "/images/fish.png",
    ]);
    const [assets, setAssets] = useState([
        {
            type: "Feliz stardust casks",
            images: [
                "/images/fish.png",
                "/images/fish.png",
                "/images/fish.png",
                "/images/fish.png",
                "/images/fish.png",
                "/images/fish.png",
            ],
        },
    ]);

    useEffect(() => {
        checkWalletIsConnected();
    }, []);

    function tabBtn(active, type) {
        let text = "";
        let className = "";
        switch (type) {
            case OVERVIEW:
                className = styles.overview;
                text = "overview";
                break;
            case CITIZEN:
                className = styles.citizen;
                text = "citizen";
                break;
            case ASSETS:
                className = styles.assets;
                text = "assets";
                break;
            case REWARDS:
                className = styles.rewards;
                text = "rewards";
                break;
            case EVENTS:
                className = styles.events;
                text = "events";
                break;
            default:
                break;
        }
        if (active === type) className += " " + styles.active;
        return (
            <button
                className={className}
                onClick={() => {
                    setActive(type);
                }}
            >
                {text}
            </button>
        );
    }

    function genContent(active) {
        switch (active) {
            case OVERVIEW:
                return (
                    <main className={styles.overview}>
                        <p>
                            <span className={styles.type}>Feliz Citizens</span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>{citizenNum}</span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>
                                Feliz Stardust Casks
                            </span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>{casksNum}</span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>
                                Feliz Property NFT
                            </span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>-</span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>Special NFT</span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>-</span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>
                                Claimable $PEARL
                            </span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>-</span>
                            <span className={styles.unit}>$PEARL</span>
                        </p>
                    </main>
                );

            case CITIZEN:
                return (
                    <main className={styles.citizen}>
                        <div className={styles.cardcontainer}>
                            {console.log(citizens)}
                            {citizens.map((url, idx) => {
                                console.log(url, idx);
                                return (
                                    <Card
                                        key={idx}
                                        className={styles.citizenCard}
                                        url={url}
                                    />
                                );
                            })}
                        </div>
                    </main>
                );

            case ASSETS:
                return (
                    <main className={styles.citizen}>
                        <div className={styles.cardcontainer}>
                            {assets.map((asset, aIdx) => {
                                return (
                                    <>
                                        <p key={"asset" + aIdx}>{asset.type}</p>
                                        {asset.images.map((url, idx) => {
                                            return (
                                                <Card
                                                    key={`${aIdx}-${idx}`}
                                                    className={
                                                        styles.citizenCard
                                                    }
                                                    url={url}
                                                />
                                            );
                                        })}
                                    </>
                                );
                            })}
                        </div>
                    </main>
                );
            default:
                return (
                    <main className={styles.none}>
                        <p>Comming soon</p>
                    </main>
                );
        }
    }

    return (
        <div className={styles.dashboard}>
            <h2>Feliz HQ</h2>
            <aside className={styles.menubar}>
                {tabBtn(active, OVERVIEW)}
                {tabBtn(active, CITIZEN)}
                {tabBtn(active, ASSETS)}
                {tabBtn(active, REWARDS)}
                {tabBtn(active, EVENTS)}
            </aside>
            <section className={styles.display}>
                <header>
                    <h3>Your Wallet</h3>
                </header>
                {genContent(active)}
            </section>
            <Img src="/images/chair.png" className={styles.chair}></Img>
            <Link href="/">
                <a className={styles.exit}>exit</a>
            </Link>
        </div>
    );
}
