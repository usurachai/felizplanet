import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

export default function Roadmap() {
    return (
        <div className="bg-gray-900 ">
            <Head>
                <title>Feliz::Readmap</title>
                <meta name="Feliz roadmap" content="roadmap" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="h-screen flex justify-center items-center min-w-[1280px] min-h-[720px]">
                <div
                    className="w-[1280px] h-[720px] bg-cover bg-no-repeat bg-[url('/images/newroadmap/bg.png')] relative rounded-2xl drop-shadow-lg

"
                >
                    {/* bolt */}
                    <div className="w-[696px] h-[838px] absolute -top-[22px] left-[489px] scale-[0.8]  animate-pulse ">
                        <Image
                            src="/images/newroadmap/bolt.png"
                            layout="fill"
                        />
                    </div>
                    {/* birbs */}
                    <div className="w-[80px] h-[82px] absolute top-[311px] left-[527px] scale-100 hover:scale-155 hover:cursor-pointer ">
                        <Link
                            href="https://birbsfriend.dotconnex.xyz/"
                            passHref
                        >
                            <a target="_blank">
                                <Image
                                    src="/images/newroadmap/birbs.png"
                                    layout="fill"
                                />
                            </a>
                        </Link>
                    </div>

                    {/* dc */}
                    <div className="w-[200px] h-[182px] absolute top-[54px] left-[223px] scale-100 hover:scale-110 hover:cursor-pointer ">
                        <Link href="https://ladyfoxynft.xyz/" passHref>
                            <a target="_blank">
                                <Image
                                    src="/images/newroadmap/dc.png"
                                    layout="fill"
                                />
                            </a>
                        </Link>
                    </div>

                    {/* bottle */}
                    <div className="w-[100px] h-[73px] absolute top-[548px] left-[277px] scale-100 hover:scale-125 hover:cursor-pointer ">
                        <Link
                            href="https://felizplanet.com/Stardustalienpotion"
                            passHref
                        >
                            <a target="_blank">
                                <Image
                                    src="/images/newroadmap/bottle.png"
                                    layout="fill"
                                />
                            </a>
                        </Link>
                    </div>

                    {/* alien #1 */}
                    <div className="w-[150px] h-[122px] absolute top-[94px] left-[589px] scale-100 hover:scale-125  hover:cursor-pointer">
                        <Image
                            src="/images/newroadmap/alien1.png"
                            layout="fill"
                        />
                    </div>
                    {/* alien #2 */}
                    <div className="w-[300px] h-[231px] absolute top-[469px] left-[777px] scale-100  hover:scale-110 hover:cursor-pointer">
                        <Image
                            src="/images/newroadmap/alien2.png"
                            layout="fill"
                        />
                    </div>
                    {/* cup */}
                    <div className="w-[120px] h-[115px] absolute top-[305px] left-[785px] scale-100  hover:scale-125 hover:cursor-pointer">
                        <Image src="/images/newroadmap/cup.png" layout="fill" />
                    </div>
                    {/* block */}
                    <div className="w-[300px] h-[180px] absolute top-[53px] left-[785px] scale-100  hover:scale-110 hover:cursor-pointer">
                        <Image
                            src="/images/newroadmap/block.png"
                            layout="fill"
                        />
                    </div>
                    {/* alien #3 */}
                    <div className="w-[120px] h-[136px] absolute top-[348px] left-[277px] scale-100 hover:scale-125  hover:cursor-pointer">
                        <Image
                            src="/images/newroadmap/alien3.png"
                            layout="fill"
                        />
                    </div>
                    {/* ship */}
                    <div className="w-[150px] h-[224px] absolute top-[369px] left-[589px] scale-100 hover:scale-110  ">
                        <Image
                            src="/images/newroadmap/ship.png"
                            layout="fill"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
