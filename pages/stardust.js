import React from "react";

export default function stardust() {
    return (
        // <div className="flex  ">
        //     <div className="bg-star w-full h-screen ">
        //         <div className="text-white m-auto">hello</div>
        //         {/* <div className="absolute top-10 left-10 m-auto h-32 w-32">
        //         <img src="/images/Machine.png" />
        //     </div>
        //     <div className="relative">
        //         <div className="absolute top-10 left-10 h-32 w-32">
        //             <img src="/images/FelizCitizen.png" />
        //         </div>
        //     </div> */}
        //     </div>
        // </div>
        <div className="flex h-screen bg-star relative">
            {/* <div className="m-auto">
                <h3>title</h3>
                <button>button</button>
            </div> */}
            <div className="absolute top-1/3 w-5/6 left-0 right-0 m-auto max-w-lg sm:w-1/2">
                <div className="absolute inset-0 z-10 h-fit w-[345px] sm:w-[512px]">
                    <img src="/images/Machine.png" />
                    <button className="absolute bottom-[23px] left-[116px] text-green skew-y-[30deg] px-1 py-3 text-sm font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 to sm:left-[173px] sm:bottom-[35px] sm:text-lg sm:px-2 sm:py-5">
                        MINT
                    </button>
                    <div className="absolute bg-white text-sm text-black skew-y-[30deg] bottom-[180px] left-[50px] sm:bottom-[285px] sm:left-[50px] sm:text-lg">
                        <p>STARDUST</p>
                        <p>PORTION</p>
                    </div>
                </div>

                <div className="absolute -top-10 left-[220px] sm:left-[370px] w-[115px] sm:w-[170px] animate-astronaut z-0  ">
                    <img src="/images/FelizCitizen.png" />
                </div>
            </div>
            <div className="w-[100px] h-[200px]  rounded-[50px/100px] absolute bg-white"></div>
        </div>
    );
}
