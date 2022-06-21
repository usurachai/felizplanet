import React, { useState, useEffect, useRef } from "react";

import Head from "next/head";
import Router from "next/router";
// import Image from "next/image";
// import { useRouter } from "next/router";

// import styles from "../styles/Home.module.css";

export default function Home() {
    useEffect(() => {
        const { pathname } = Router;
        if (pathname == "/") {
            Router.push("/stardust");
        }
    });

    return (
        <Head>
            <title>Feliz</title>
            <meta name="Feliz" content="Feliz" />
            <link rel="icon" href="/favicon.ico" />
        </Head>
    );
}
