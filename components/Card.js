import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./Card.module.scss";
import { FELIZ_CITIZENS, FELIZ_STARDRUST } from "../utils/enum/token";

const ipfsLoader = ({ src, width, quality }) => {
    return `https://ipfs.infura.io/ipfs/${src}?w=${width}&q=${quality || 75}`;
};

const pinataLoader = ({ src, width, quality }) => {
    return `https://gateway.pinata.cloud/ipfs/${src}?w=${width}&q=${
        quality || 75
    }`;
};

export default function Card({
    className,
    url,
    key,
    tokenId,
    type,
    balance,
    name,
}) {
    function genImage(url) {
        if (url.indexOf("https://ipfs.infura.io/ipfs/") >= 0) {
            return (
                <Image
                    loader={ipfsLoader}
                    src={url.replace("https://ipfs.infura.io/ipfs/", "")}
                    alt={"nft"}
                    layout="fill"
                />
            );
        } else if (url.indexOf("https://gateway.pinata.cloud/ipfs/") >= 0) {
            return (
                <Image
                    loader={pinataLoader}
                    src={url.replace("https://gateway.pinata.cloud/ipfs/", "")}
                    alt={"nft"}
                    layout="fill"
                />
            );
        } else {
            return <Image src={url} alt={"nft"} layout="fill" />;
        }
    }

    function genDescription(tokenId, type, balance) {
        let dct = "";
        switch (type) {
            case FELIZ_CITIZENS:
                dct = `feliz citizens # ${tokenId}`;
                break;
            case FELIZ_STARDRUST:
                dct = `${balance} # ${tokenId}`;
                break;
            default:
                dct = "none";
        }
        return dct;
    }

    function genTitle(type, name) {
        let title = "";
        switch (type) {
            case FELIZ_CITIZENS:
                title = `feliz citizens`;
                break;
            case FELIZ_STARDRUST:
                title = name;
                break;
            default:
                title = "none";
        }
        return title;
    }

    return (
        <div key={"Card" + key} className={styles.Card + " " + className}>
            <Image
                src="/images/card.png"
                alt={"NFT background"}
                layout="fill"
                className={styles.background}
            />
            <div className={styles.img}>{genImage(url)}</div>
            <span className={styles.title}>{genTitle(type, name)}</span>
            <span className={styles.description}>
                {genDescription(tokenId, type, balance)}
            </span>
        </div>
    );
}
