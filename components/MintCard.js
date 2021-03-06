/* eslint-disable react/jsx-key */
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "./MintCard.module.scss";
import Image from "next/image";
import {
    FELIZ_CITIZENS,
    FELIZ_STARDRUST_SILVER,
    FELIZ_STARDRUST_GOLD,
} from "../utils/enum/token";
import { MINT, MINT_COMMING, MINT_PRESALE } from "../utils/enum/mint";
import { ethers } from "ethers";
import { contractError } from "../utils/errorFilter";

// import { getContractAddress } from 'ethers/lib/utils'
import contractAddress from "../contractAddress.json";
import citizenAbi from "../contracts/artifacts/FelizCitizen.json";
import stardrustAbi from "../contracts/artifacts/StardustCask.json";

// import Img from './Img'
import Web3 from "web3";

import { SUCCESS, LOADING, FAILED } from "../components/Modal";
import { SC_ID_GOLD, SC_ID_SILVER, SC_ID_BRONZ } from "../utils/enum/scnftType";

// stardust cask, allow mint ?
import { stardustallowmint } from "../stardust";

export default function MintCard({
    src,
    className,
    alt,
    account,
    type,
    countdown,
    modal,
    alert,
    proof,
    fnConnectWallet,
    address,
}) {
    // const [type, setType] = useState('')
    const [title, setTitle] = useState("");
    const [maxSupply, setMaxSupply] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0);
    const [cost, setCost] = useState(0);
    const [amount, setAmount] = useState(0);
    const [mintType, setMintType] = useState("");
    const [mintOpen, setMintOpen] = useState(false);
    const [contract, setContract] = useState(undefined);
    const [limit, setLimit] = useState(1);
    // cosnt [curDate, setCurDate] = useState("curDate")
    const [timer, setTimer] = useState(-1);
    const [presale, setPresale] = useState("");

    const router = useRouter();

    // console.log("mintcard proof: ", proof);

    useEffect(() => {
        switch (type) {
            case FELIZ_CITIZENS:
                setTitle("Feliz Citizens");
                break;
            case FELIZ_STARDRUST_SILVER:
                setTitle("Silver Stardust");
                break;
            case FELIZ_STARDRUST_GOLD:
                setTitle("Golden Stardust");
                break;
        }
    }, [type]);

    useEffect(() => {
        if (countdown === "00:00:00:00") {
            setMintOpen(true);
        } else {
            setMintOpen(false);
        }
    }, [countdown]);

    const loadCitizenInfos = async () => {
        try {
            const { ethereum } = window;
            // console.log("load", ethereum)
            if (ethereum) {
                // const contract = new Web3
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const nftContract = new ethers.Contract(
                    contractAddress.FelizCitizen,
                    citizenAbi.abi,
                    signer
                );

                // Presale End date
                const preSaleEndDate = await nftContract.preSaleEndDate();
                setPresale(preSaleEndDate.toNumber() * 1000);
                // console.log("preSaleEndDate: ", preSaleEndDate.toString())
                console.log(
                    "preSaleEndDate: ",
                    preSaleEndDate.toNumber() * 1000
                );

                // total number
                const maxSupply = await nftContract.maxSupply();
                console.log("maxSupply: ", maxSupply.toNumber());
                setMaxSupply(maxSupply.toNumber());

                // totalSupply
                const totalSupply = await nftContract.totalSupply();
                console.log("totalSupply: ", totalSupply.toNumber());
                setTotalSupply(totalSupply.toNumber());

                // cost
                const cost = await nftContract.cost();
                console.log("cost: ", ethers.utils.formatUnits(cost, "ether"));
                // setCost(ethers.utils.formatUnits(cost, 'ether'))

                // Presale cost
                const preSaleCost = await nftContract.preSaleCost();
                console.log("cost: ", ethers.utils.formatUnits(cost, "ether"));
                // setCost(ethers.utils.formatUnits(preSaleCost, 'ether'))

                // Presale maxMintAmountPerTx
                const maxMintAmountPresale =
                    await nftContract.maxMintAmountPresale();
                console.log(
                    "maxMintAmountPresale: ",
                    maxMintAmountPresale.toNumber()
                );

                // MaxMintAmountPerTx
                const maxMintAmountPerTx =
                    await nftContract.maxMintAmountPerTx();
                console.log(
                    "maxMintAmountPerTx: ",
                    maxMintAmountPerTx.toNumber()
                );

                return {
                    preSaleEndDate: preSaleEndDate.toNumber() * 1000,
                    cost: ethers.utils.formatUnits(cost, "ether"),
                    preSaleCost: ethers.utils.formatUnits(preSaleCost, "ether"),
                    maxMintAmountPresale: maxMintAmountPresale.toNumber(),
                    maxMintAmountPerTx: maxMintAmountPerTx.toNumber(),
                };
            }
        } catch (err) {
            console.log(err);
        }
        return undefined;
    };

    const loadGoldCask = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const nftContract = new ethers.Contract(
                    contractAddress.StardustCask,
                    stardrustAbi.abi,
                    signer
                );

                // cost
                const cost = await nftContract.getGoldenCasksCost();
                console.log(
                    "Gold cost: ",
                    ethers.utils.formatUnits(cost, "ether")
                );
                setCost(
                    Math.floor(
                        ethers.utils.formatUnits(cost, "ether") * 1000 + 1
                    ) / 1000
                );

                setMaxSupply(100);

                // Total Gold CASKs
                const totalGoldCasks = await nftContract.getTotalGoldenCasks();
                setTotalSupply(totalGoldCasks.toNumber());
                console.log("totalGoldCasks: ", totalGoldCasks.toNumber());

                // Max CASK per address
                const MaxCasksPerAddress =
                    await nftContract.MaxCasksPerAddress();
                // setMaxSupply(MaxCasksPerAddress.toNumber())
                console.log(
                    "MaxCasksPerAddress: ",
                    MaxCasksPerAddress.toNumber()
                );

                // Minted Gold Casks
                // const mintedGoldCasks = (await stardustContract.balanceOf(signer.getAddress(), SC_ID_GOLD)).toNumber()

                // Limit
                // setLimit(MaxCasksPerAddress.toNumber() - mintedGoldCasks)
                setLimit(MaxCasksPerAddress.toNumber());
            }
        } catch (err) {
            console.log(err);
        }
        return undefined;
    };

    const loadSilverCask = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const nftContract = new ethers.Contract(
                    contractAddress.StardustCask,
                    stardrustAbi.abi,
                    signer
                );

                // cost
                const cost = await nftContract.getSilverCasksCost();
                console.log(
                    "Silver cost: ",
                    ethers.utils.formatUnits(cost, "ether")
                );
                setCost(
                    Math.floor(
                        ethers.utils.formatUnits(cost, "ether") * 1000 + 1
                    ) / 1000
                );

                setMaxSupply(100);

                // total Silver Cask
                const totalSilverCasks =
                    await nftContract.getTotalSilverCasks();
                setTotalSupply(totalSilverCasks.toNumber());
                console.log("totalSilverCasks: ", totalSilverCasks.toNumber());

                // Minted Silver casks
                // const mintedSilverCasks = (await stardustContract.balanceOf(signer.getAddress(), SC_ID_SILVER)).toNumber()

                // Max CASK
                const MaxCasksPerAddress =
                    await nftContract.MaxCasksPerAddress();
                // setMaxSupply(MaxCasksPerAddress.toNumber())
                console.log(
                    "MaxCasksPerAddress: ",
                    MaxCasksPerAddress.toNumber()
                );

                // Limit
                // setLimit(MaxCasksPerAddress.toNumber() - mintedSilverCasks)
                setLimit(MaxCasksPerAddress.toNumber());
            }
        } catch (err) {
            console.log(err);
        }
        return undefined;
    };

    const mintCitizens = async (amount, cost, signer) => {
        console.log("mint Citizen");

        // console.log("preSaleEndDate: ", presale);
        // console.log("now: ", new Date().valueOf());

        // console.log("mintOpen: ", mintOpen);
        // console.log("address: ", await signer.getAddress());

        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // const provider = new ethers.providers.Web3Provider(ethereum)
                // const signer = provider.getSigner();
                // console.log("signer: ", await signer.getAddress())
                const nftContract = new ethers.Contract(
                    contractAddress.FelizCitizen,
                    citizenAbi.abi,
                    signer
                );

                console.log("initializing payment");
                console.log("amount: ", amount);
                console.log(
                    "cost for mint: ",
                    ethers.utils.parseEther((amount * cost).toString())
                );
                // console.log("balance: ", (await signer.getBalance()).toNumber())
                modal("", "Minting in process, please wait.", LOADING);
                // await nftContract.setPaused(false)

                if (new Date().valueOf() < presale) {
                    // if (new Date().valueOf() < 1646226694000) {
                    // mint whitelist
                    console.log("mint whitelist");
                    console.log("amount: ", amount);
                    console.log(
                        "value: ",
                        ethers.utils.parseEther((amount * cost).toString())
                    );
                    console.log("proof: ", proof);
                    console.log(
                        "proof byte32: ",
                        ethers.utils.formatBytes32String(toString(proof))
                    );

                    let nftTxn = await nftContract.mintWhitelist(
                        amount,
                        // ethers.utils.formatBytes32String(toString(proof)),
                        proof ? proof.split(",") : [],
                        // [
                        //     "0xe979b7d6ca070c535101fe02859ed6b4155c2998060d5e66b3c5568b45f62ba1",
                        //     "0xd407939729d2b772c6321853a5172caf65f061daf612d21bc4e714f8ff04337f",
                        //     "0x9b87ee4ed4c6cb96c3f31636d2493da8f90f9c1e39e27608e9c04427f1bed7b1",
                        //     "0x12439383eb4910dceaff908c0d15921e06c2ef5d415adb0365b9dd330cbfa2a5",
                        //     "0x3784993e28b1697c87d1535ea131f73dca45e7eb5b1939de274b8bb4986d173f",
                        //     "0x89095332eaa0f40ea91ff4af54fe26db5d41024f9c4f614457ef255e774679b2",
                        // ],
                        {
                            value: ethers.utils.parseEther(
                                (amount * cost).toString()
                            ),
                        }
                    );

                    console.log("Mining... please wait");
                    await nftTxn.wait();
                    modal(
                        "Congratulation!",
                        "Your transaction is completed.",
                        SUCCESS
                    );

                    // totalSupply
                    const totalSupply = await nftContract.totalSupply();
                    console.log("totalSupply: ", totalSupply.toNumber());
                    setTotalSupply(totalSupply.toNumber());

                    console.log(
                        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
                    );
                } else {
                    // mint
                    console.log("mint");
                    let nftTxn = await nftContract.mint(amount, {
                        value: ethers.utils.parseEther(
                            (amount * cost).toString()
                        ),
                    });

                    console.log("Mining... please wait");
                    await nftTxn.wait();
                    modal(
                        "Congratulation!",
                        "Your transaction is completed.",
                        SUCCESS
                    );

                    // totalSupply
                    const totalSupply = await nftContract.totalSupply();
                    console.log("totalSupply: ", totalSupply.toNumber());
                    setTotalSupply(totalSupply.toNumber());

                    console.log(
                        `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
                    );
                }
            }
        } catch (err) {
            // console.log(err.body, typeof err)
            // console.log(err.message.split('(')[0], typeof err.message)
            // console.log(err.stack, typeof err.stack)
            // console.log(await JSON.parse(err.message));
            console.log(err.message, typeof err.message);
            // modal("")

            const _match = err.message.match(/error=(.*?), method/);
            if (_match) {
                const error_code = JSON.parse(_match[1])["code"];

                if (error_code === -32000) {
                    modal(
                        "",
                        "Insufficient funds for intrinsic transaction",
                        FAILED
                    );
                } else {
                    modal("", JSON.parse(_match[1])["message"], FAILED);
                }
            } else {
                modal("", err.message, FAILED);
            }
            // modal("", contractError(err), FAILED);
            // modal("", err.message, FAILED)
        }
    };

    const mintSilverCask = async (amount, cost, signer) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // const provider = new ethers.providers.Web3Provider(ethereum)
                // const signer = provider.getSigner();
                // console.log("signer: ", await signer.getAddress())
                const nftContract = new ethers.Contract(
                    contractAddress.StardustCask,
                    stardrustAbi.abi,
                    signer
                );

                console.log("initializing payment");
                console.log("amount: ", amount);
                console.log("cost: ", amount * cost);
                // console.log("totoal cost: ", { value: ethers.utils.parseEther((amount * cost).toString()).toNumber() })
                modal("", "Minting in process, please wait.", LOADING);

                // await nftContract.setPaused(false)
                let nftTxn = await nftContract.purchaseSilverCask(amount, {
                    value: ethers.utils.parseEther((amount * cost).toString()),
                });
                // let nftTxn = await nftContract.purchaseGoldCask(amount, { value: ethers.utils.parseEther((amount * cost).toString()) })

                console.log("Mining... please wait");
                await nftTxn.wait();
                modal(
                    "Congratulation!",
                    "Your transaction is completed.",
                    SUCCESS
                );

                // Minted CASKs
                const totalSilverCasks =
                    await nftContract.getTotalSilverCasks();
                setTotalSupply(totalSilverCasks.toNumber());
                console.log("totalSilverCasks: ", totalSilverCasks.toNumber());

                console.log(
                    `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
                );

                // Minted Silver casks
                // const mintedSilverCasks = (await stardustContract.balanceOf(signer.getAddress(), SC_ID_SILVER)).toNumber()

                // Max CASK
                const MaxCasksPerAddress =
                    await nftContract.MaxCasksPerAddress();
                // setMaxSupply(MaxCasksPerAddress.toNumber())
                console.log(
                    "MaxCasksPerAddress: ",
                    MaxCasksPerAddress.toNumber()
                );

                // Limit
                // setLimit(MaxCasksPerAddress.toNumber() - mintedSilverCasks)
                setLimit(MaxCasksPerAddress.toNumber());
            }
        } catch (err) {
            // modal("", err.message, FAILED)
            modal("", err.message.split("(")[0], FAILED);
            // modal("", contractError(err), FAILED);

            // modal("", err.message, FAILED)

            console.log(err.name, typeof err);
            console.log(err.message, typeof err.message);
        }
    };

    const mintGoldCask = async (amount, cost, signer) => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                // const contract = new Web3
                // const provider = new ethers.providers.Web3Provider(ethereum)
                // const signer = provider.getSigner();
                // console.log("signer: ", await signer.getAddress())
                const nftContract = new ethers.Contract(
                    contractAddress.StardustCask,
                    stardrustAbi.abi,
                    signer
                );

                console.log("initializing payment");
                console.log("amount: ", amount);
                console.log("cost: ", amount * cost);
                // console.log("totoal cost: ", { value: ethers.utils.parseEther((amount * cost).toString()).toNumber() })
                modal("", "Minting in process, please wait.", LOADING);

                // await nftContract.setPaused(false)
                let nftTxn = await nftContract.purchaseGoldCask(amount, {
                    value: ethers.utils.parseEther((amount * cost).toString()),
                });

                console.log("Mining... please wait");
                await nftTxn.wait();
                modal(
                    "Congratulation!",
                    "Your transaction is completed.",
                    SUCCESS
                );

                // Minted CASKs
                const totalGoldCasks = await nftContract.getTotalGoldenCasks();
                setTotalSupply(totalGoldCasks.toNumber());
                console.log("totalGoldCasks: ", totalGoldCasks.toNumber());
                console.log(
                    `Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
                );

                // Max CASK per address
                const MaxCasksPerAddress =
                    await nftContract.MaxCasksPerAddress();
                // setMaxSupply(MaxCasksPerAddress.toNumber())
                console.log(
                    "MaxCasksPerAddress: ",
                    MaxCasksPerAddress.toNumber()
                );

                // Minted Gold Casks
                // const mintedGoldCasks = (await stardustContract.balanceOf(signer.getAddress(), SC_ID_GOLD)).toNumber()

                // Limit
                // setLimit(MaxCasksPerAddress.toNumber() - mintedGoldCasks)
                setLimit(MaxCasksPerAddress.toNumber());
            }
        } catch (err) {
            // modal("", err.message, FAILED)
            modal("", err.message.split("(")[0], FAILED);
            // modal("", contractError(err), FAILED);

            // modal("", err.message, FAILED)
            console.log(err.message.split("(")[0]);

            console.log(err.name, typeof err);
            console.log(err.message, typeof err.message);
        }
    };

    const mint = () => {
        if (!account) {
            // router.push('#home')
            alert("Pleas connect wallet");
            return;
        }
        if (amount <= 0) {
            alert("Amount must be larger than 0");
            return;
        }
        console.log(account);
        console.log(account.getAddress());
        switch (type) {
            case FELIZ_CITIZENS:
                mintCitizens(amount, cost, account);
                break;
            case FELIZ_STARDRUST_SILVER:
                mintSilverCask(amount, cost, account);
                // setTitle("Feliz Stardrust")
                break;
            case FELIZ_STARDRUST_GOLD:
                mintGoldCask(amount, cost, account);
                // setTitle("Feliz Stardrust")
                break;
        }
    };

    useEffect(() => {
        switch (type) {
            case FELIZ_CITIZENS:
                // loadCitizenInfos()
                return () => {};

            case FELIZ_STARDRUST_SILVER:
                break;

            case FELIZ_STARDRUST_GOLD:
                break;

            default:
                break;
        }
    }, []);

    useEffect(() => {
        console.log("type", type);
        switch (type) {
            case FELIZ_CITIZENS:
                loadCitizenInfos().then((result) => {
                    if (result == undefined) {
                        console.log(result);
                    } else {
                        const {
                            preSaleEndDate,
                            cost,
                            preSaleCost,
                            maxMintAmountPresale,
                            maxMintAmountPerTx,
                        } = result;
                        // console.log("Get result", preSaleEndDate)
                        const updateCost = () => {
                            if (preSaleEndDate <= Date.now()) {
                                setMintType(MINT);
                                setCost(cost);
                                setLimit(maxMintAmountPerTx);
                                // console.log("seCost cost", cost)
                            } else {
                                setMintType(MINT_PRESALE);
                                setCost(preSaleCost);
                                setLimit(maxMintAmountPresale);
                                // console.log("seCost preSaleCost", preSaleCost)
                            }
                        };
                        updateCost();
                        setTimer((prev) => {
                            clearInterval(prev);
                            return setInterval(updateCost, 1000);
                        });
                    }
                });
                break;

            case FELIZ_STARDRUST_SILVER:
                // loadSilverCask();
                loadSilverCask().then(() => {
                    console.log("stardustallowmint: ", stardustallowmint);
                    if (stardustallowmint === true) {
                        setMintType("MINT");
                    } else {
                        setMintType("NO_MINT");
                    }
                });

                break;

            case FELIZ_STARDRUST_GOLD:
                // console.log("CARD TYPE", type)

                // loadGoldCask();

                loadGoldCask().then(() => {
                    console.log("stardustallowmint: ", stardustallowmint);
                    if (stardustallowmint === true) {
                        setMintType("MINT");
                    } else {
                        setMintType("NO_MINT");
                    }
                });
                // setTitle("Feliz Stardrust")
                break;

            default:
                break;
        }
    }, [account]);

    const increase = () => {
        setAmount((amount) => {
            const newAmount = amount + 1;
            if (maxSupply < newAmount + totalSupply || newAmount > limit)
                return amount;
            return amount + 1;
        });
    };

    const decrease = () => {
        setAmount((amount) => {
            const newAmount = amount - 1;
            if (0 > newAmount) return amount;
            return amount - 1;
        });
    };

    const mintImage = (mintType) => {
        // console.log("mintType", mintType);
        // console.log("mintOpen", mintOpen);

        // console.log(address);
        if (!address) {
            // wallet not connected
            return (
                <div className={styles.buy} onClick={fnConnectWallet}>
                    <Image
                        src="/images/mint_connectwallet.png"
                        alt="buy"
                        layout="fill"
                    />
                </div>
            );
        } else {
            // wallet connected

            if (!mintOpen) {
                return (
                    <div className={styles.buy}>
                        <Image
                            src="/images/mint_coming.png"
                            alt="buy"
                            layout="fill"
                        />
                    </div>
                );
            } else {
                if (mintType === MINT) {
                    return (
                        <div className={styles.buy} onClick={mint}>
                            <Image
                                src="/images/mint.png"
                                alt="buy"
                                layout="fill"
                            />
                        </div>
                    );
                } else if (mintType === MINT_PRESALE) {
                    return (
                        <div className={styles.buy} onClick={mint}>
                            <Image
                                src="/images/mint.png"
                                alt="buy"
                                layout="fill"
                            />
                        </div>
                    );
                } else {
                    return (
                        <div className={styles.buy}>
                            <Image
                                src="/images/mint_coming.png"
                                alt="buy"
                                layout="fill"
                            />
                        </div>
                    );
                }
            }
        }
    };

    const cardlabel = () => {
        let label = "";

        if (mintOpen) {
            if (type === FELIZ_CITIZENS) {
                label = `mint : ${totalSupply}/${maxSupply}\nprice : ${cost} eth`;
            } else {
                if (stardustallowmint) {
                    label = `mint : ${totalSupply}/${maxSupply}
                    price : ${cost} eth`;
                } else {
                    label = "Generating...";
                }
            }
        } else {
            label = "Generating...";
        }

        return label;
    };

    return (
        <div className={styles.MintCard + " " + className}>
            <Image
                src="/images/mintcard.png"
                alt={alt}
                layout="fill"
                className={styles.background}
            />
            <p className={styles.title}>{title}</p>
            {/* {mintOpen ? (
                <p className={styles.contents}>
                    mint : {totalSupply}/{maxSupply}
                    <br />
                    price : {cost} eth
                </p>
            ) : (
                <p className={styles.contents}>Generating...</p>
            )} */}

            <p className={styles.contents}>{cardlabel()}</p>

            <p className={styles.amount}>{amount}</p>
            <div className={styles.img}>
                <Image src={src} alt={alt} layout="fill" />
            </div>
            <button className={styles.prev} onClick={decrease} />
            <button className={styles.next} onClick={increase} />
            {mintImage(mintType)}
        </div>
    );
}
