import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

// import Image from "next/image";
import Wallet from "../components/Wallet";
import { useMetaMask, useConnectedMetaMask } from "metamask-react";
import network from "../network_game.json";
import { ethers } from "ethers";
import { shortenAddress } from "../utils/shortenAddress";
import catnipAbi from "../contracts/artifacts/Catnip.json";
import contractAddress from "../contractAddress.json";
import { errManager } from "../utils/errorManager";

import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import MyDialog from "../components/MyDialog";
const whiteListAddresses = require("../whitelist.json");

export default function Stardust() {
    // dialog
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [msg, setMsg] = useState("");

    const [board, setBoard] = useState("");

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }
    // end dialog

    const navlst = [
        {
            href: "/",
            data: "HOME",
            newWindow: false,
        },
        // {
        //     href: "https://faucets.chain.link/rinkeby",
        //     data: "RINKEBY FAUCET",
        //     newWindow: true,
        // },
    ];
    const [release, setRelease] = useState(false);

    const handleMint = () => {
        setRelease(!release);
    };

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
        console.log(`proof: ${_proof.join(",")}`);
        if (_proof.length > 0) {
            setBoard("ALLOW");
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
        // return () => {
        //   second
        // }
    }, [status, account, chainId]);

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
        if (!account) {
            // not connected
            setTitle("You are not connect");
            setMsg("Please connect to MetaMask");
            setIsOpen(true);
            return;
        }

        if (chainId != "0x4") {
            setTitle("Incorrect Chain ID");
            setMsg("Please connect to Rinkeby Network");
            setIsOpen(true);
            setBoard("Wrong Chain");
            return;
        }

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const nftContract = new ethers.Contract(
                    contractAddress.Minigame,
                    catnipAbi.abi,
                    signer
                );
                const cost = await nftContract.cost();
                console.log(cost);
                console.log("cost: ", ethers.utils.formatUnits(cost, "ether"));

                let nftTxn = await nftContract.mintAllowList(
                    1,
                    proof ? proof.split(",") : [],
                    {
                        value: ethers.utils.parseEther(cost.toString()),
                    }
                );
                setBoard("Minting");

                console.log("Minting... please wait");

                setTitle("Mining...");
                setMsg("Please wait");
                setIsOpen(true);

                await nftTxn.wait();

                setTitle("Congratuation");
                setMsg("Your transaction is completed");
                setIsOpen(true);
                setBoard("Congrat");
                setRelease(!release);
            }
        } catch (err) {
            console.error(err);
            console.log(errManager(err));
            setTitle("Error");
            setMsg(errManager(err));
            setIsOpen(true);
            setBoard("ERROR !!!");
        }
    };

    return (
        <div className="flex h-screen bg-star bg-cover relative">
            <Head>
                <title>Stardust</title>
            </Head>
            <header className="mt-8 py-8 px-12 flex flex-row justify-between w-full items-center h-20">
                <nav className="text-white flex flex-row space-x-4 font-badabb text-4xl">
                    {navlst.map((navEle, idx) => {
                        return (
                            <Link key={idx.toString()} href={navEle.href}>
                                {navEle.newWindow ? (
                                    <a target="_blank">{navEle.data}</a>
                                ) : (
                                    <a>{navEle.data}</a>
                                )}
                            </Link>
                        );
                    })}
                </nav>
                <div className="flex ">
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  focus:ring-4  font-medium  text-sm px-5 py-2.5 mr-2 mb-2 rounded-full"
                        onClick={hanleConnect(status)}
                    >
                        {addr}
                    </button>
                </div>
            </header>

            <div className="absolute top-1/4 left-0 right-0 m-auto max-w-lg ">
                <div className="absolute inset-0 h-fit w-[345px] sm:w-[600px]">
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
                    <img className="z-0" alt="box_2" src="/images/box_2.png" />

                    <button
                        className="absolute z-40 bottom-[23px] left-[116px] text-green skew-y-[30deg] px-1 py-3 text-sm font-semibold bg-gradient-to-r from-green-400 to-blue-500 sm:left-[172px] sm:bottom-[38px] sm:text-2xl sm:px-1 sm:py-6 text-gray-200 text-shadow-lg hover:bg-gradient-to-r hover:from-green-600 hover:to-blue-700 border border-black"
                        onClick={mintStardust}
                    >
                        MINT
                    </button>
                    <div className="absolute z-30 font-medium bg-none text-sm text-gray-200 skew-y-[30deg] bottom-[180px] left-[50px] sm:bottom-[270px] sm:left-[50px] sm:text-3xl sm:w-[180px] sm:h-[60px] py-2 text-center text-shadow-lg">
                        <p>{board}</p>
                    </div>
                    <div
                        className={`absolute bottom-[110px]  left-[200px]  w-[60px] sm:w-[100px] sm:bottom-[140px] sm:left-[260px] z-10 ${
                            release
                                ? "animate-stardust animation_iteration_count_1"
                                : ""
                        }`}
                    >
                        <img alt="goldent" src="/images/box_4.gif" />
                    </div>
                    <div className="z-20 absolute w-[40px] bottom-[220px] left-[60px] animate-ingredient ">
                        <img alt="portion2" src="/images/portion2.png" />
                    </div>
                    <div className="z-20 absolute w-[40px] bottom-[220px] left-[60px] animate-ingredient animation-delay-2000">
                        <img alt="fish2" src="/images/fish2.png" />
                    </div>
                    <div className="z-20 absolute w-[40px] bottom-[220px] left-[60px] animate-ingredient animation-delay-4000">
                        <img alt="stardust2" src="/images/stardust2.png" />
                    </div>
                </div>

                <div className="absolute -top-10 left-[220px] sm:left-[440px] w-[115px] sm:w-[200px] animate-astronaut ">
                    <img alt="citizen" src="/images/astronaut.png" />
                </div>
            </div>
            {/* <div className="w-[100px] h-[200px]  rounded-[50px/100px] absolute bg-white"></div> */}
            <MyDialog
                isOpen={isOpen}
                openModal={openModal}
                closeModal={closeModal}
                title={title}
                msg={msg}
            />
        </div>
    );
}
