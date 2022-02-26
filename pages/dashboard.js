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
import { FELIZ_CITIZENS, FELIZ_STARDRUST } from "../utils/enum/token";

import meta2image, { scUri2image } from "../utils/ipfs2http";

const OVERVIEW = "OVERVIEW";
const CITIZEN = "CITIZEN";
const ASSETS = "ASSETS";
const REWARDS = "REWARDS";
const EVENTS = "EVENTS";

export default function Dashboard() {
    const route = useRouter();
    const [account, setAccount] = useState(undefined);

    function redirectHome(error) {
        // console.log(error)
        route.push("/", undefined, { scroll: false });
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
        load(account);
        setAccount(account);
    }

    // Get balances of the tokens which account own.
    const load = async (signer) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                setLoadedBalance(false);
                setLoadedCitizen(false);
                setLoadedAssets(false);

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
                const goldCasks = (
                    await stardustContract.balanceOf(
                        signer.getAddress(),
                        SC_ID_GOLD
                    )
                ).toNumber();
                const silverCasks = (
                    await stardustContract.balanceOf(
                        signer.getAddress(),
                        SC_ID_SILVER
                    )
                ).toNumber();
                const bronzCasks = (
                    await stardustContract.balanceOf(
                        signer.getAddress(),
                        SC_ID_BRONZ
                    )
                ).toNumber();
                const totalCasks = goldCasks + silverCasks + bronzCasks;
                console.log("stardust balance: ", totalCasks);
                setLoadedBalance(true);
                setCasksNum(totalCasks);
                if (citizen === 0 && totalCasks === 0) {
                    redirectHome("0 balance");
                } else {
                    // get citizen images
                    const citizenTokens = await citizenContract.walletOfOwner(
                        signer.getAddress()
                    );
                    const citizenImages = [];
                    for (let i = 0; i < citizenTokens.length; i++) {
                        const tokenId = citizenTokens[i];
                        try {
                            const imageURI = await meta2image(
                                await citizenContract.tokenURI(tokenId)
                            );
                            citizenImages.push({
                                image: imageURI,
                                tokenId: tokenId.toString(),
                            });
                        } catch (error) {
                            console.log(error);
                        }
                        setCitizens(citizenImages);
                    }
                    console.log("citizenImages", citizenImages);
                    setLoadedCitizen(true);

                    // console.log(await scUri2image(goldUri))
                    const scImages = [];
                    if (goldCasks > 0) {
                        scImages.push({
                            image: await scUri2image(
                                await stardustContract.uri(SC_ID_GOLD)
                            ),
                            tokenId: SC_ID_GOLD,
                            balance: goldCasks,
                        });
                    }
                    if (silverCasks > 0) {
                        scImages.push({
                            image: await scUri2image(
                                await stardustContract.uri(SC_ID_SILVER)
                            ),
                            tokenId: SC_ID_SILVER,
                            balance: goldCasks,
                        });
                    }
                    if (bronzCasks > 0) {
                        scImages.push({
                            image: await scUri2image(
                                await stardustContract.uri(SC_ID_BRONZ)
                            ),
                            tokenId: SC_ID_BRONZ,
                            balance: goldCasks,
                        });
                    }
                    console.log("scImages", scImages);
                    setStardusts(scImages);
                    // stardustContract
                    setLoadedAssets(true);
                }
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    };

    const [active, setActive] = useState(OVERVIEW);
    const [citizenNum, setCitizenNum] = useState(0);
    const [casksNum, setCasksNum] = useState(0);
    const [citizens, setCitizens] = useState([]);
    const [stardusts, setStardusts] = useState([]);

    const [loadedBalance, setLoadedBalance] = useState(true);
    const [loadedCitizen, setLoadedCitizen] = useState(true);
    const [loadedAssets, setLoadedAssets] = useState(true);

    useEffect(() => {
        checkWalletIsConnected();
        return () => {
            if (window.ethereum && window.ethereum.removeEventListener) {
                window.ethereum.removeEventListener("accountsChanged");
                window.ethereum.removeEventListener("networkChanged");
            }
        };
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

    function genTitle(active) {
        switch (active) {
            case OVERVIEW:
                return <h3>Overview</h3>;

            case CITIZEN:
                return <h3>Citizen</h3>;

            case ASSETS:
                return <h3>Assets</h3>;

            case REWARDS:
                return <h3>Rewards</h3>;

            case EVENTS:
                return <h3>Events</h3>;

            default:
                return <h3>None</h3>;
        }
    }

    function genContent(active) {
        switch (active) {
            case OVERVIEW:
                return (
                    <main className={styles.overview}>
                        <p>
                            <span className={styles.type}>Feliz Citizens</span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>
                                {loadedBalance && citizenNum}
                                {!loadedBalance && "..."}
                            </span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>
                                Feliz Stardust Casks
                            </span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>
                                {loadedBalance && casksNum}
                                {!loadedBalance && "..."}
                            </span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>
                                Feliz Property NFT
                            </span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>
                                {loadedBalance && "-"}
                                {!loadedBalance && "..."}
                            </span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>Special NFT</span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>
                                {loadedBalance && "-"}
                                {!loadedBalance && "..."}
                            </span>
                            <span className={styles.unit}>unit</span>
                        </p>
                        <p>
                            <span className={styles.type}>
                                Claimable $PEARL
                            </span>
                            <span className={styles.seprt}>:</span>
                            <span className={styles.amount}>
                                {loadedBalance && "-"}
                                {!loadedBalance && "..."}
                            </span>
                            <span className={styles.unit}>$PEARL</span>
                        </p>
                    </main>
                );

            case CITIZEN:
                return (
                    <main className={styles.citizen}>
                        {!loadedCitizen && (
                            <p className={styles.loading}>Loading...</p>
                        )}
                        {loadedCitizen && (
                            <div className={styles.cardcontainer}>
                                {console.log(citizens)}
                                {citizens.map(({ image, tokenId }, idx) => {
                                    console.log(image, idx);
                                    return (
                                        <Card
                                            key={idx}
                                            className={styles.citizenCard}
                                            url={image}
                                            tokenId={tokenId}
                                            type={FELIZ_CITIZENS}
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </main>
                );

            case ASSETS:
                return (
                    <main className={styles.citizen}>
                        {!loadedAssets && (
                            <p className={styles.loading}>Loading...</p>
                        )}
                        {loadedAssets && (
                            <div className={styles.cardcontainer}>
                                <p>Feliz stardust casks</p>
                                {stardusts.map(
                                    (
                                        {
                                            image: { uri, name },
                                            tokenId,
                                            balance,
                                        },
                                        idx
                                    ) => {
                                        return (
                                            <Card
                                                key={`stardust-${idx}`}
                                                className={styles.citizenCard}
                                                url={uri}
                                                tokenId={tokenId}
                                                type={FELIZ_STARDRUST}
                                                balance={balance}
                                                name={name}
                                            />
                                        );
                                    }
                                )}
                            </div>
                        )}
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
                <header>{genTitle(active)}</header>
                {genContent(active)}
            </section>
            <Img src="/images/chair.png" className={styles.chair}></Img>
            <Link href="/">
                <a className={styles.exit}>exit</a>
            </Link>
        </div>
    );
}
