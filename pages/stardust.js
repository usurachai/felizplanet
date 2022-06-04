import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import { useMetaMask, useConnectedMetaMask } from "metamask-react";
import { ethers } from "ethers";
import { shortenAddress } from "../utils/shortenAddress";
import contractAbi from "../contracts/artifacts/StardustPotion.json";
import contractAddress from "../contractAddress.json";
import { errManager } from "../utils/errorManager";
import Typewriter from "typewriter-effect";
import StardustSocial from "../components/StardustSocial";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import MyDialog from "../components/MyDialog";
const whiteListAddresses = require("../wl_stardust.json");
import axios from "axios";

const CHAIN_ID = process.env.NODE_ENV == "development" ? "0x4" : "0x1";
const CHAIN_NAME =
    process.env.NODE_ENV == "development" ? "Rinkeby" : "Mainnet";
// const CHAIN_ID = "0x1";
// const CHAIN_NAME = "Mainnet";

const baseURL =
    process.env.NODE_ENV == "development"
        ? "http://localhost:3000"
        : "https://felizplanet.com/";

export default function Stardust() {
    // dialog
    // const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [msg, setMsg] = useState(null);

    const [board, setBoard] = useState("");
    const [minting, setMinting] = useState(false);

    const [qoutas, setQoutas] = useState([]);

    // function closeModal() {
    //     setIsOpen(false);
    // }

    // function openModal() {
    //     setIsOpen(true);
    // }
    // end dialog

    const [release, setRelease] = useState(false);

    // const handleMint = () => {
    //     setRelease(!release);
    // };

    // partners
    const partners = [
        "4Dimension.png",
        "GustCafe.png",
        "Lobster.png",
        "Phuket9.png",
        "PoolGuru.png",
        "Roof.png",
        "VipKaron.png",
        "DuoBrew.png",
        "LailaNail.png",
        "Lyfe.png",
        "PhuketSwiming.png",
        "PrimaPearl.png",
        "Songsarn.png",
        "WildBeef.png",
        "GrandVip.png",
        "Layers.png",
        "MatsuWood.png",
        "Pikgo.png",
        "RawaiVIPVilla.png",
        "Thames.png",
        "kk.png",
        "CALMM.png",
        "Canpus.png",
        "DiveSupply.png",
        "HomeSolution.png",
        "Paripas.png",
        "Saily.png",
        "SanSabay.png",
        "ThamesPoolAccess.png",
        "Boat.png",
        "Bird.png",
        "WxParadi.png",
    ];

    // merkle tree
    const [proof, setProof] = useState("");
    const whiteListAddressesLeaves = whiteListAddresses.map((x) =>
        keccak256(x)
    );
    const tree = new MerkleTree(whiteListAddressesLeaves, keccak256, {
        sortPairs: true,
    });
    const MerkleProof = (address) => {
        const hashedAddress = keccak256(address);
        const _proof = tree.getHexProof(hashedAddress);
        // console.log(`proof: ${_proof.join(",")}`);
        if (_proof.length > 0) {
            setBoard("ALLOW LIST");
        } else {
            setBoard("NOT ALLOW");
        }
        setProof(_proof.join(","));
    };

    // const cntMetamask = useMetaMask();
    const { status, connect, account, chainId, ethereum } = useMetaMask();
    const [addr, setAddr] = useState("");

    useEffect(() => {
        // console.log(status, account, chainId, ethereum);
        setMsg(null);

        if (status === "initializing") {
            setAddr("Synchronisation with MetaMask ongoing...");
        } else if (status === "unavailable") setAddr("MetaMask not available");
        else if (status === "notConnected") {
            setAddr("Connect to MetaMask");
            connect();
        } else if (status === "connecting") {
            setAddr("Connecting...");
            setBoard("Connecting...");
        } else if (status === "connected") {
            setAddr(shortenAddress(account) + " [" + chainId + "]");
            setBoard("Connected");
            MerkleProof(account);
        }

        setRelease(false);

        // return () => {
        //   second
        // }
    }, [status, account, chainId]);

    useEffect(() => {
        (async () => {
            // console.log(process.env.NODE_ENV);
            try {
                const { data } = await axios.get(`${baseURL}/api/qouta`);
                // console.log("hi: ", data);
                setQoutas(data);
            } catch (err) {
                console.error(err);
                setQoutas([]);
            }
        })();
    }, [minting]);

    const hanleConnect = (status) => () => {
        if (status === "initializing") {
            setAddr("Synchronisation with MetaMask ongoing...");
        } else if (status === "unavailable") setAddr("MetaMask not available");
        else if (status === "notConnected") {
            setAddr("Connect to MetaMask");
            connect();
        } else if (status === "connecting") {
            setAddr("Connecting...");
            setBoard("Connecting...");
        } else if (status === "connected") {
            setAddr(shortenAddress(account) + " [" + chainId + "]");
            setBoard("Connected");
            MerkleProof(account);
        }
    };

    const mintStardust = async () => {
        setRelease(false);
        setMsg(null);

        if (!account) {
            // not connected
            // setTitle("You are not connect");
            setMsg("Please connect to MetaMask");
            // setIsOpen(true);
            return;
        }

        if (chainId != CHAIN_ID) {
            // setTitle("Incorrect Chain ID");
            setMsg(`Change your connected network to ${CHAIN_NAME}`);
            // setIsOpen(true);
            setBoard("Wrong Chain");
            return;
        }

        setBoard("MINING");
        setMinting(true);

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const nftContract = new ethers.Contract(
                    contractAddress.Minigame,
                    contractAbi.abi,
                    signer
                );
                const cost = await nftContract.cost();
                // console.log(cost);
                // console.log("cost: ", ethers.utils.formatUnits(cost, "ether"));

                // check qouta
                let mintqouta = 1;

                const qouta = qoutas.find(
                    (q) => q.account.toUpperCase() == account.toUpperCase()
                );
                // console.log("qouta: ", qouta);
                if (qouta) {
                    // found
                    if (qouta.qouta == 0) {
                        mintqouta = 0;
                    } else {
                        mintqouta = qouta.qouta;
                    }
                }

                if (mintqouta > 0) {
                    let nftTxn = await nftContract.mintAllowList(
                        mintqouta,
                        proof ? proof.split(",") : [],
                        {
                            value: ethers.utils.parseEther(cost.toString()),
                        }
                    );

                    const receipt = await nftTxn.wait();

                    // update qouta
                    try {
                        const res = await axios.put(
                            `${baseURL}/api/qouta?acc=${account}`
                        );
                        // console.log(res);
                    } catch (err) {
                        console.error(err);
                    }

                    setMsg("Your potion is produced");
                    setMinting(false);
                    setBoard("Congrat");
                    setRelease(true);
                } else {
                    // no qouta
                    setMsg("No mint qouta for this batch");
                    setMinting(false);
                    setBoard("No Qouta");
                }
            }
        } catch (err) {
            console.error(err);

            // check error because transcation replacement
            if (err.message.includes("transaction was replaced")) {
                // replaced transaction

                // https://docs.ethers.io/v5/api/providers/types/#providers-TransactionReceipt
                if (err.message.match(/status":(.*?),/)[1] === "1") {
                    // success transaction
                    setMsg("Your potion is produced");
                    setMinting(false);
                    setBoard("Congrat");
                    setRelease(true);
                }
            } else {
                // console.log(errManager(err));
                // setTitle("Error");
                setMsg(errManager(err));
                // setIsOpen(true);
                setMinting(false);
                setBoard("ERROR !!!");
            }
        }
    };

    return (
        <div className="flex flex-col  h-full bg-star bg-cover relative">
            <Head>
                <title>Stardust</title>
            </Head>
            {/* https://tailwindcss.com/docs/position#sticky-positioning-elements */}
            <header className=" flex justify-between items-center p-2 sm:px-8 sm:pt-4">
                <Link href="/" passHref={true}>
                    <img
                        alt="logo"
                        src="/images/logo_cat.png"
                        className="cursor-pointer w-[100px] h-[100px] sm:w-[150px] sm:h-[150px]"
                    />
                </Link>
                <div className="flex z-100">
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  focus:ring-4  font-medium  text-sm px-5 py-2.5 mr-2 mb-2 rounded-full flex space-x-2 items-center"
                        onClick={hanleConnect(status)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                        </svg>
                        <spa>{addr}</spa>
                    </button>
                </div>
            </header>

            <div className=" flex my-[10px] sm:my-10 font-monoid text-2xl sm:text-4xl lg:text-6xl text-gray-200 justify-center text-center">
                {/* <Typewriter
                    options={{
                        strings: [
                            "Stardust Portion Machine",
                            // "with so many privileges",
                        ],
                        autoStart: true,
                        loop: false,
                        pauseFor: 360000,
                    }}
                /> */}

                <Typewriter
                    onInit={(typewriter) => {
                        typewriter
                            .typeString("Stardust Potion Machine")
                            .changeDelay(50)
                            .start();
                    }}
                />
            </div>
            <div className="text-purple-500 font-monoid text-sm sm:text-2xl flex justify-center text-center mb-10 sm:mb-10 h-8">
                {msg ? (
                    // <Typewriter
                    //     options={{
                    //         strings: [
                    //             msg,
                    //             // "with so many privileges",
                    //         ],
                    //         autoStart: true,
                    //         loop: false,
                    //         delay: 50,
                    //         pauseFor: 360000,
                    //     }}
                    // />

                    <Typewriter
                        onInit={(typewriter) => {
                            typewriter
                                .typeString(msg)
                                // .callFunction(() => {
                                //     console.log("String typed out!");
                                // })
                                // .pauseFor(2500)
                                // .deleteAll()
                                // .callFunction(() => {
                                //   console.log('All strings were deleted');
                                // })
                                .changeDelay(50)
                                .start();
                            // .stop();
                        }}
                    />
                ) : (
                    ""
                )}
            </div>

            <div className="mt-20 flex items-center justify-center  m-auto text-white text-5xl">
                <div className="relative  w-[345px] h-[360px] sm:w-[600px] sm:h-[630px]">
                    <img
                        className="absolute z-20"
                        alt="box_1"
                        src="/images/box_1.png"
                    />
                    <img
                        className="absolute z-30"
                        alt="box_3"
                        src="/images/box_3.png"
                    />
                    <img
                        className={`absolute z-40 w-[226px] -bottom-[9.5px] left-[95.5px] sm:w-[393.5px] sm:-bottom-[13px] sm:left-[166px] ${
                            minting ? "" : "hidden"
                        }`}
                        alt="eye"
                        src="/images/Eyes_masks.gif"
                    />
                    <img className="z-0" alt="box_2" src="/images/box_2.png" />

                    <button
                        className="absolute z-40 bottom-[21px] left-[98px] text-green skew-y-[30deg] px-1 py-4 text-xs font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sm:left-[172px] sm:bottom-[38px] sm:text-2xl sm:px-1 sm:py-6 text-gray-200 text-shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 border border-black"
                        onClick={mintStardust}
                    >
                        MINT
                    </button>
                    <div className="absolute z-30 font-medium bg-none text-lg text-gray-200 skew-y-[30deg] w-[120px] bottom-[150px] left-[20px] sm:bottom-[270px] sm:left-[50px] sm:text-4xl sm:w-[180px] sm:h-[60px] py-2 text-center text-shadow-lg font-digi">
                        <p>{board}</p>
                    </div>
                    <div
                        className={`absolute bottom-[80px]  left-[140px]  w-[80px] sm:w-[150px] sm:bottom-[140px] sm:left-[230px] z-20 animation_iteration_count_1 sm:animation_iteration_count_1 ${
                            release
                                ? "animate-stardust_xs  sm:animate-stardust"
                                : ""
                        }`}
                    >
                        <img alt="goldent" src="/images/box_4.gif" />
                    </div>
                    <div className="z-20 absolute w-[30px] bottom-[140px] left-[30px] sm:bottom-[220px] sm:left-[60px] sm:w-[40px] animate-ingredient_xs sm:animate-ingredient">
                        <img alt="portion2" src="/images/portion2.png" />
                    </div>
                    <div className="z-20 absolute w-[30px] bottom-[140px] left-[30px] sm:bottom-[220px] sm:left-[60px] sm:w-[40px] animate-ingredient_xs  animation-delay-2000 sm:animate-ingredient sm:animation-delay-2000">
                        <img alt="fish2" src="/images/fish2.png" />
                    </div>
                    <div className="z-20 absolute w-[30px] bottom-[140px] left-[30px] sm:bottom-[220px] sm:left-[60px] sm:w-[40px] animate-ingredient_xs  animation-delay-4000 sm:animate-ingredient sm:animation-delay-4000">
                        <img alt="stardust2" src="/images/stardust2.png" />
                    </div>

                    <div className="absolute -top-10 left-[220px] sm:left-[440px] w-[115px] sm:w-[200px] z-10 animate-astronaut ">
                        <img alt="citizen" src="/images/astronaut.png" />
                    </div>
                </div>
            </div>
            {/* partners */}

            <div className="container mt-10 mb-10 sm:mt-20 sm:mb-20 mx-auto px-4  flex flex-col ">
                <h1 className="font-monoid text-xl sm:text-5xl text-white text-center">
                    Exclusive Partners
                </h1>
                <h2 className="mb-10  sm:mb-20 sm:mt-[10px] font-monoid text-sm sm:text-2xl text-white text-center">
                    with so many privileges
                </h2>
                {/* <div className="mb-20 font-monoid text-xl sm:text-2xl text-white flex justify-center">
                    <Typewriter
                        options={{
                            strings: ["with so many privileges", "have fun"],
                            autoStart: true,
                            loop: true,
                        }}
                    />
                </div> */}
                <div className=" grid grid-cols-4 sm:grid-cols-6 gap-4">
                    {partners.map((partner) => (
                        <div key={partner}>
                            <img
                                src={`/images/stardust_partners/${partner}`}
                                alt={partner}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <footer className="mt-10 mb-2 sm:mb-6">
                <StardustSocial />
            </footer>

            {/* <MyDialog
                isOpen={isOpen}
                openModal={openModal}
                closeModal={closeModal}
                title={title}
                msg={msg}
            /> */}
        </div>
    );
}

// export async function getServerSideProps(context) {
//     const response = await fetch(`http://localhost:3002/api/qouta`);
//     const data = await response.json();
//     console.log(data);
//     return {
//         props: { data },
//     };
// }
