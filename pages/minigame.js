/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Img from "../components/Img";
import ImageBack from "../components/ImageBack";
import Wallet from "../components/Wallet";
import Navbar from "../components/Navbar";
import Spacecraft from "../components/Spacecraft";
import Countdown from "../components/Countdown";
import ProgressBar from "../components/ProgressBar";
import Socials from "../components/Socials";
import Modal, {
    SUCCESS,
    FAILED,
    LOADING,
    INPUT,
    INFO,
} from "../components/Modal";
import PopUp from "../components/PopUp";
import errorFilter from "../utils/errorFilter";
import { ethers } from "ethers";
import { contractError } from "../utils/errorFilter";
import styles from "../styles/Minigame.module.scss";

import ImageLink from "../components/ImageLink";
import { SC_ID_GOLD, SC_ID_SILVER, SC_ID_BRONZ } from "../utils/enum/scnftType";
import { useMetaMask } from "metamask-react";

import contractAddress from "../contractAddress.json";
import minigameAbi from "../contracts/artifacts/SupplyGas.json";
import erc20Abi from "../contracts/artifacts/IERC20.json";
import { navStart, navEnd } from "../dates";
import network from "../network_game.json";

const spender = contractAddress.Minigame;

const COOKIE_EXPIRE_SECOND = 60 * 60 * 3; // 3 hours

export default function Minigame() {
    const cntMetamask = useMetaMask();

    useEffect(() => {
        checkWalletIsConnected();
    }, [cntMetamask.status, cntMetamask.chainId]);

    const router = useRouter();
    const [navlist, setNavlist] = useState([
        {
            href: "/",
            data: "Home",
            newWindow: false,
        },
        {
            href: "https://faucets.chain.link/rinkeby",
            data: "rinkeby faucet",
            newWindow: true,
        },
        // {
        //     href: "/#roadmap",
        //     data: "Roadmap",
        // },
        // {
        //     href: "/minigame",
        //     data: "Faq",
        // },
        // {
        //     href: "/minigame",
        //     data: "My collection",
        // },
    ]);

    const [startTime, setStartTime] = useState(navStart);
    const [endTime, setEndTime] = useState(navEnd);
    const [address, setAddress] = useState("");
    const [account, setAccount] = useState(undefined);
    const [sd, setSD] = useState(0);
    const [supply, setSupply] = useState(0);

    // For message
    const [popupText, setPopupText] = useState("");
    const [popupNum, setPopupNum] = useState(0);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState("");
    const [modalType, setModalType] = useState(undefined);
    const [modalAction, setModalAction] = useState(undefined);
    const [modalBtn, setModalBtn] = useState("");
    const [modalNum, setModalNum] = useState(0);
    const [modalClosable, setModalClosable] = useState(false);
    const [modalInput, setModalInput] = useState("");
    const [modalError, setModalError] = useState("");
    const [isApproved, setIsApproved] = useState(false);

    // Alert message
    const alert = (text) => {
        setPopupText(text);
        setPopupNum((prev) => prev + 1);
    };

    // Modal message
    const modal = (
        title,
        content,
        type,
        btnTxt,
        action,
        input,
        errormsg,
        closable
    ) => {
        console.log({
            title,
            content,
            type,
            btnTxt,
            action,
            input,
            errormsg,
            closable,
        });
        setModalTitle(title);
        setModalContent(content);
        setModalType(type);
        if (action) setModalAction({ action });
        else setModalAction(undefined);
        setModalBtn(btnTxt);
        setModalNum((prev) => prev + 1);
        setModalClosable(closable);
        setModalInput(input);
        setModalError(errormsg);
    };

    // Check if wallet is connected
    const checkWalletIsConnected = async () => {
        const { ethereum } = window;
        // console.log(ethereum.chainId, typeof ethereum.chainId)
        if (ethereum) {
            // detect Metamask account change
            window.ethereum.on("accountsChanged", function (accounts) {
                setAccount(undefined);
                setAddress("");
                connectWalletHandler();
            });

            // detect Network account change
            window.ethereum.on("networkChanged", function (networkId) {
                console.log(
                    "networkChanged",
                    networkId,
                    typeof networkId,
                    networkId !== network.id
                );
                if (networkId !== network.id) {
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
        } else if (ethereum.chainId !== network.id) {
            // alert("Change network to Rinkeby network.")
            setAccount(undefined);
            setAddress("");
        } else {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = await provider.getSigner();
                setAccount(signer);
                setAddress(await signer.getAddress());
                getSD();
                getSupply(signer);
                const allowance = await getAllowance(signer);
                console.log("isapproved", allowance);
                if (allowance < 0) alert("Something wrong");
                else if (allowance === 0) setIsApproved(false);
                else setIsApproved(true);
            } catch (err) {}
        }
    };

    // Connect wallet
    const connectWalletHandler = async () => {
        const { ethereum } = window;

        // console.log(ethereum.chainId, typeof ethereum.chainId)
        if (!ethereum) {
            alert("Please install Metamask");
        } else if (ethereum.chainId !== network.id) {
            alert(`Change network to ${network.name} network.`);
        } else {
            try {
                const provider = new ethers.providers.Web3Provider(ethereum);
                await provider.send("eth_requestAccounts", []);
                const signer = await provider.getSigner();
                console.log("signer", signer);
                setAccount(signer);
                setAddress(await signer.getAddress());
                getSD();
                getSupply(signer);
                const allowance = await getAllowance(signer);
                console.log("isapproved", allowance);
                if (allowance < 0) alert("Something wrong");
                else if (allowance === 0) setIsApproved(false);
                else setIsApproved(true);
            } catch (err) {
                console.log(err);
                alert(errorFilter(err));
            }
        }
    };

    // Get SD balance
    const getSD = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                const provider = new ethers.providers.Web3Provider(ethereum);
                console.log(provider);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(
                    contractAddress.ERC20,
                    erc20Abi.abi,
                    signer
                );

                // get SD
                const balance = Number(
                    ethers.utils.formatEther(
                        await contract.balanceOf(signer.getAddress())
                    )
                );
                setSD(balance);
                console.log("balance", balance);
                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(err);
        }
    };

    const sendSD = async (signer, to) => {
        let errorMsg = "";
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                const contract = new ethers.Contract(
                    contractAddress.Minigame,
                    minigameAbi.abi,
                    signer
                );

                // sendSD token
                modal(
                    "",
                    "Stardust sending to your friend and wallet please wait",
                    LOADING
                );
                const txn = await contract.getGas(to);
                await txn.wait();
                console.log(txn);
                await getSD(signer);
                await getSupply(signer);
                modal(
                    "Congratulation!",
                    "Stardrust already send to your wallet.",
                    SUCCESS
                );

                inc_gamecounter();

                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(contractError(err));
            modal(
                "Send Stardrust token to your friend",
                "",
                INPUT,
                "Send SD",
                (address) => {
                    sendSD(account, to);
                },
                to,
                contractError(err),
                true
            );
        }
    };

    const getAllowance = async (signer) => {
        let ret = -1;
        if (!signer) return ret;
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // console.log(signer)
                const contract = new ethers.Contract(
                    contractAddress.ERC20,
                    erc20Abi.abi,
                    signer
                );
                const allowance = Number(
                    ethers.utils.formatEther(
                        await contract.allowance(signer.getAddress(), spender)
                    )
                );
                console.log(allowance);
                if (allowance === 0) ret = 0;
                else ret = 1;
                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(err);
            return ret;
        }
        return ret;
    };

    const getSupply = async (signer) => {
        let ret = -1;
        if (!signer) return ret;
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // console.log(signer)
                const contract = new ethers.Contract(
                    contractAddress.Minigame,
                    minigameAbi.abi,
                    signer
                );
                const supply = await contract.getSupply(signer.getAddress());
                console.log(supply);
                supply = Number(ethers.utils.formatEther(supply));
                setSupply(supply);
                console.log("supply", supply, typeof supply);
                ret = supply;
                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(err);
            return ret;
        }
        return ret;
    };

    const approve = async (signer) => {
        if (!signer) return false;
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // console.log(signer)
                const contract = new ethers.Contract(
                    contractAddress.ERC20,
                    erc20Abi.abi,
                    signer
                );
                modal("", "Approve in progress, please wait...", LOADING);
                const txn = await contract.approve(
                    spender,
                    "999999000000000000000000"
                );
                await txn.wait();
                // setSupply(txn)
                console.log("approve", txn);
                // const allowance = await getAllowance(signer)
                // console.log("approve allowance", allowance)
                // if (allowance > 0) {
                setIsApproved(true);
                modal("Congratulation", "You are approved!", SUCCESS);
                // }
                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(err);
            modal("", contractError(err), FAILED);
            return false;
        }
        return true;
    };

    const doSupply = async (signer) => {
        if (!signer) return false;
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // console.log(signer)
                const contract = new ethers.Contract(
                    contractAddress.Minigame,
                    minigameAbi.abi,
                    signer
                );
                modal("", "Supply Stardust to spaceship, please wait", LOADING);
                const txn = await contract.sendGas();
                await txn.wait();
                // setSupply(txn)
                console.log("doSupply", txn);
                setIsApproved(true);
                const supply = await getSupply(signer);
                setSupply(supply);
                await getSD(signer);
                modal(
                    "",
                    "Your stardust already supplied to spaceship",
                    SUCCESS
                );
                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(err);
            modal("", contractError(err), FAILED);
            return false;
        }
        return true;
    };

    const claimWL = async (signer) => {
        if (!signer) return false;
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // console.log(signer)
                const contract = new ethers.Contract(
                    contractAddress.Minigame,
                    minigameAbi.abi,
                    signer
                );
                modal("", "Claiming, please wait.", LOADING);
                const txn = await contract.cliamWL();
                await txn.wait();
                // setSupply(txn)
                console.log("approve", txn);
                await getSupply(signer);
                modal(
                    "Congratulation!",
                    "You are whitelisted see you on mint date.",
                    SUCCESS
                );
                // const balance = await nftContract.preSaleEndDate()
            }
        } catch (err) {
            console.log(err);
            modal("", contractError(err), FAILED);
            return false;
        }
        return true;
    };

    const inc_gamecounter = () => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("fzgame="))
            ?.split("=")[1];

        if (cookieValue === undefined) {
            // no cookie
            document.cookie = `fzgame=1;max-age=${COOKIE_EXPIRE_SECOND};`;
        } else {
            // cookie detected
            document.cookie = `fzgame=${
                +cookieValue + 1
            };max-age=${COOKIE_EXPIRE_SECOND};`;
        }
    };

    const checkCounter = () => {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("fzgame="))
            ?.split("=")[1];
        // console.log(cookieValue);

        if (cookieValue >= 3) {
            // exceed qouta
            // alert("exceed");
            return false;
        } else {
            // within qouta
            // alert("within");
            return true;
        }
    };

    useEffect(() => {
        // checkWalletIsConnected();
        return () => {
            if (window.ethereum && window.ethereum.removeEventListener) {
                window.ethereum.removeEventListener("accountsChanged");
                window.ethereum.removeEventListener("networkChanged");
            }
        };
    }, []);

    return (
        <div className={styles.minigame}>
            <Head>
                <title>Minigame</title>
            </Head>
            <Modal
                title={modalTitle}
                content={modalContent}
                type={modalType}
                btnTxt={modalBtn}
                action={modalAction}
                num={modalNum}
                input={modalInput}
                errmsg={modalError}
                closable={modalClosable}
            />
            {popupText && (
                <PopUp timeout={3000} text={popupText} num={popupNum} />
            )}
            <header>
                <Navbar navs={navlist} className={styles.mainNav} />
                <Wallet
                    address={address}
                    onClick={connectWalletHandler}
                    className={styles.wallet}
                />
                {address && <span className={styles.SD}>$SD {sd}</span>}
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
                        if (!account) {
                            alert("Please connect wallet");
                            return;
                        }
                        if (Date.now() >= endTime) {
                            modal(
                                "",
                                "The faliz already landed on Earth, Now it's mint time!",
                                INFO,
                                "MINT NOW",
                                () => {
                                    router.push("/#mission", undefined, {
                                        scroll: false,
                                    });
                                }
                            );
                        } else {
                            // check condition here
                            if (checkCounter()) {
                                // true

                                // popup for the input of receiver address
                                modal(
                                    "Send Stardrust token to your friend",
                                    "",
                                    INPUT,
                                    "Send SD",
                                    (value) => {
                                        sendSD(account, value);
                                    },
                                    "",
                                    "",
                                    true
                                );
                            } else {
                                // false
                                alert("Please try again in next 3 hours");
                            }
                        }
                    }}
                ></span>
                <div className={styles.light}></div>
                <p className={styles.sendcap}>
                    Send Stardrust to your partner (Click Cat to pop-up send
                    token box)
                </p>
                {isApproved && (
                    <Img
                        src="/images/supply.png"
                        className={styles.supply}
                        onClick={() => {
                            if (!account) {
                                alert("Please connect wallet");
                                return;
                            }
                            if (Date.now() >= endTime) {
                                modal(
                                    "",
                                    "The faliz already landed on Earth, Now it's mint time!",
                                    SUCCESS,
                                    "MINT NOW",
                                    () => {
                                        router.push("/#mission", undefined, {
                                            scroll: false,
                                        });
                                    }
                                );
                            } else {
                                doSupply(account);
                            }
                        }}
                    />
                )}
                {!isApproved && (
                    <Img
                        src="/images/approve.png"
                        className={styles.supply}
                        onClick={() => {
                            if (!account) {
                                alert("Please connect wallet");
                                return;
                            }
                            if (Date.now() >= endTime) {
                                modal(
                                    "",
                                    "The faliz already landed on Earth, Now it's mint time!",
                                    SUCCESS,
                                    "MINT NOW",
                                    () => {
                                        router.push("/#mission", undefined, {
                                            scroll: false,
                                        });
                                    }
                                );
                            } else {
                                approve(account);
                            }
                        }}
                    />
                )}
                <ImageLink
                    src="/images/spaceship.png"
                    className={styles.discord}
                    // href=" https://discord.gg/qvN3ZC6DvB"
                    href=" https://discord.com"
                />
                <div className={styles.tab}>
                    <Image src="/images/tab.png" alt="tab" layout="fill" />
                    <p>
                        Your total supply : <span>{supply}</span> SD
                    </p>
                    <span
                        onClick={() => {
                            if (!account) {
                                alert("Please connect wallet");
                                return;
                            }
                            claimWL(account);
                        }}
                    >
                        Claim Lottery
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
