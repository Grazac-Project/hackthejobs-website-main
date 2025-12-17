"use client";

import Image from "next/image";
import { FaFileVideo } from "react-icons/fa";
import { LiaMoneyBillWaveSolid } from "react-icons/lia";
import { LuUsers } from "react-icons/lu";
import { IoIosArrowRoundForward } from "react-icons/io";
import { Videocam, VideoLabel } from "@mui/icons-material";
import { FaVideo } from "react-icons/fa6";
import { formatPrice } from "@/Utils/price-formater";
import { getCurrencySymbol } from "@/Utils/currency-formatter";
export default function EventCard({
  title,
  month,
  day,
  venue,
  price,
  joinedLabel,
  image,
  action,
  amount,
  currency,
  id,
}) {

  const displayPrice = price?.toLowerCase() === "paid" ? `${getCurrencySymbol(currency)}${formatPrice(amount)}` : "Free";
  const attendeeText = !joinedLabel || joinedLabel === 0 ? "No attendee yet." : `${joinedLabel} ${joinedLabel === 1 ? "person has" : "people have"} joined already`;

  return (
    <article
      key={id}
      className="group relative overflow-hidden rounded-[8px] bg-[white] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
      onClick={action}
    >
      {/* Media */}
      <div className="relative aspect-[16/5] w-full">
        <Image
          src={image}
          alt=""
          fill
          priority={false}
          className="object-cover h-[36p]"
        />
      </div>

      {/* Content */}
      <div className=" flex gap-4 px-6 py-4">
        {/* Date pill */}
        <div
          aria-label={`${month} ${day}`}
          className=" rounded-[6px] px-[6px] py-1 w-[38px] h-[43px] shadow-md"
        >
          <div className=" bg-blue-100  text-center text-[10px] font-bold  text-primary">
            {month
              ? new Date(month).toLocaleDateString("en-US", {
                month: "short",
              })
              : ""}
          </div>
          <div className=" pt-1 text-center text-[14px] font-semibold leading-none text-[#000000]">
            {day
              ? new Date(month).toLocaleDateString("en-US", {
                day: "2-digit",
              })
              : ""}
          </div>
        </div>
        <div>
          {/* Title */}
          <h3 className="mb-2 font-bold leading-[100%] test-[14px]  text-[#000000]">
            {title}
          </h3>

          {/* Meta */}
          <div className="grid gap-1 text-[10px] text-[#667085]">
            <div className="flex items-center gap-2">
              <FaVideo className="h-[14px] w-[14px]" />
              <span>{venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <LiaMoneyBillWaveSolid className="h-[14px] w-[14px]" />
              <span>
                {/* {price === "paid"
                  ? `${getCurrencySymbol(currency)}${formatPrice(amount)}`
                  : price} */}
                {displayPrice}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <LuUsers className="h-[14px] w-[14px]" />

              <span>
                {/* {joinedLabel === 0
                  ? "No attendee yet."
                  : `${joinedLabel} joined already`} */}
                {attendeeText}
              </span>
            </div>
          </div>

          {/* CTA */}
          <p className="text-sm text-primary font-medium flex items-center mt-4 cursor-pointer">
            Register
            <IoIosArrowRoundForward className="text-[16px] text-primary" />
          </p>
        </div>
      </div>
    </article>
  );
}
