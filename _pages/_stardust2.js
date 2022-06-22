import React from "react";
import Head from "next/head";
import Link from "next/link";

export default function Stardust2() {
    return (
        <div className="flex h-screen bg-star bg-cover relative">
            <Head>
                <title>Stardust 2</title>
            </Head>
            <header className="fixed top-0 left-0 right-0 flex justify-between items-center p-2 sm:px-8 sm:pt-4">
                <Link href="/" passHref={true}>
                    <img
                        alt="logo"
                        src="/images/logo_cat.png"
                        className="cursor-pointer w-[80px] h-[80px] sm:w-[150px] sm:h-[150px]"
                    />
                </Link>
                <div className="flex ">
                    <button
                        type="button"
                        className="focus:outline-none text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  focus:ring-4  font-medium  text-sm px-5 py-2.5 mr-2 mb-2 rounded-full flex space-x-2 items-center"
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
                        <spa>test</spa>
                    </button>
                </div>
            </header>

            <div className="flex items-center justify-center  m-auto text-white text-5xl">
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
                        className="absolute z-40 w-[226px] -bottom-[9.5px] left-[95.5px] sm:w-[393.5px] sm:-bottom-[13px] sm:left-[166px] hidden"
                        alt="eye"
                        src="/images/Eyes_masks.gif"
                    />
                    <img className="z-0" alt="box_2" src="/images/box_2.png" />

                    <button className="absolute z-40 bottom-[21px] left-[98px] text-green skew-y-[30deg] px-1 py-4 text-xs font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 sm:left-[172px] sm:bottom-[38px] sm:text-2xl sm:px-1 sm:py-6 text-gray-200 text-shadow-lg hover:bg-gradient-to-r hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 border border-black">
                        MINT
                    </button>
                    <div className="absolute z-30 font-medium bg-none text-sm text-gray-200 skew-y-[30deg] w-[120px] bottom-[150px] left-[20px] sm:bottom-[270px] sm:left-[50px] sm:text-3xl sm:w-[180px] sm:h-[60px] py-2 text-center text-shadow-lg">
                        <p>Congratulation</p>
                    </div>

                    <div
                        className={`absolute bottom-[80px]  left-[140px]  w-[80px] sm:w-[150px] sm:bottom-[140px] sm:left-[230px] z-20 animation_iteration_count_1 sm:animation_iteration_count_1 ${
                            true
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
                </div>
            </div>
        </div>
    );
}
