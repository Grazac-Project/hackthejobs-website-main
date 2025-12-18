"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Error({ text, path, buttonText }) {
  const router = useRouter();
  return (
    <div className="min-h-screen  bg-[#EFF6FF] xm:bg-[#fff]">
      <div className="font-whyte modal w-[447px] sm:w-[343px] xm:w-[90%]  md:w-[90%] h-fit-screen p-[24px] mt-[32px] mx-auto bg-[#fff] rounded-[16px] border-solid border-[1px] border-[#fff] z-5 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col justify-center items-center gap-[2px] mb-[8px]">
          <div className="mb-[8px]">
            <Image src="/fail.png" width={84} height={84} alt="fail" />
          </div>
          {/* <h4 className="font-medium text-[32px] leading-[130%] text-center text-[#121927] mb-[8px]">
            Opps! 
          </h4> */}
          <p className="font-regular text-[18px] leading-[20.8px] font-semibold sm:leading-[24.8px] text-[#555555] text-center mb-[40px]">
            {text} !!!
          </p>
          <button
            className="w-[275px] xm:w-[90%]  h-[46px]  font-whyte text-[16px] text-[#fff] font-medium bg-[#1453FF] leading-[150%] tracking-[3%] rounded-[8px]"
            onClick={() => router.push(path || "/market-place")}
          >
            {buttonText || " Go back "}
          </button>
        </div>
      </div>
      {/* </div> */}
    </div>
  );
}
