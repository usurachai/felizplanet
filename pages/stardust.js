import React, { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import Image from "next/image";

export default function Stardust() {
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

    return (
        <div className="flex h-screen bg-star relative">
            <Head>
                <title>Stardust</title>
            </Head>
            <header className="py-8 px-12">
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
            </header>
            {/* <div className="m-auto">
                <h3>title</h3>
                <button>button</button>
            </div> */}
            <div className="absolute top-1/3 w-5/6 left-0 right-0 m-auto max-w-lg sm:w-1/2">
                <div className="absolute inset-0 z-10 h-fit w-[345px] sm:w-[512px]">
                    <img alt="machine" src="/images/Machine.png" />
                    <button
                        className="absolute bottom-[23px] left-[116px] text-green skew-y-[30deg] px-1 py-3 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 to sm:left-[173px] sm:bottom-[35px] sm:text-lg sm:px-2 sm:py-5"
                        onClick={handleMint}
                    >
                        MINT
                    </button>
                    <div className="absolute bg-white text-sm text-black skew-y-[30deg] bottom-[180px] left-[50px] sm:bottom-[285px] sm:left-[50px] sm:text-lg">
                        <p>STARDUST</p>
                        <p>PORTION</p>
                    </div>
                    <div
                        className={`absolute bottom-[110px] left-[200px] z-10 w-[60px] sm:w-[100px] sm:bottom-[140px] sm:left-[310px] ${
                            release
                                ? "animate-stardust animation_iteration_count_1"
                                : ""
                        }`}
                    >
                        <img alt="goldent" src="/images/golden.gif" />
                    </div>
                </div>

                <div className="absolute -top-10 left-[220px] sm:left-[370px] w-[115px] sm:w-[170px] animate-astronaut z-0  ">
                    <img alt="citizen" src="/images/FelizCitizen.png" />
                </div>
            </div>
            {/* <div className="w-[100px] h-[200px]  rounded-[50px/100px] absolute bg-white"></div> */}
        </div>
    );
}
