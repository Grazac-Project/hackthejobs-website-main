"use client";
import { useState } from "react";
import { FaCalendarDays } from "react-icons/fa6";
import { getCurrencySymbol } from "@/Utils/currency-formatter";
import { formatPrice } from "@/Utils/price-formater";

const ProductInfo = ({
  title,
  description,
  date,
  startTime,
  endTime,
  location,
  amount,
  currency,
  type,
  onMakePayment,
}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getDaysUntil = (dateString) => {
    if (!dateString) return 0;
    const eventDate = new Date(dateString);
    const today = new Date();
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Title and Description */}
      <div className="pt-2">
        <h3 className="mb-2 font-semibold leading-[120%] text-[24px] text-[#000000]">
          {title}
        </h3>
      </div>
      <div className="flex flex-col gap-20">
        {/* Event Details Card */}
        <div className="rounded-lg border border-[#EAEAEA] bg-[#FAFAFA] p-4">
          <h4 className="text-[16px] font-semibold text-[#000000] mb-4">
            Event Details
          </h4>

          {/* Date */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <FaCalendarDays className="text-[#292D32] text-[18px]" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#000000]">
                {formatDate(date)}
              </p>
              <p className="text-[12px] text-[#787878] mt-1">
                Starts in {getDaysUntil(date)} days
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"
                  fill="#292D32"
                />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#000000]">
                {location}
              </p>
              <p className="text-[12px] text-[#787878] mt-1">Online session</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center mt-0.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z"
                  fill="#292D32"
                />
              </svg>
            </div>
            <div>
              <p className="text-[14px] font-medium text-[#000000]">
                {formatTime(startTime)} - {formatTime(endTime)}
              </p>
              <p className="text-[12px] text-[#787878] mt-1">
                45 mins duration
              </p>
            </div>
          </div>
        </div>

        {/* Price and Payment Button */}
        <div className="flex items-center justify-between rounded-lg border border-[#EAEAEA] bg-[#FAFAFA] p-4">
          <div className="text-[24px] font-semibold text-[#000000]">
            {type !== "free"
              ? `${getCurrencySymbol(currency)}${formatPrice(amount)}`
              : "Free"}
          </div>
          <button
            onClick={onMakePayment}
            className="rounded-lg bg-[#1453FF] px-6 py-3 text-[white] font-medium text-[14px] leading-5 cursor-pointer shadow hover:bg-[#0d36cc] focus:outline-none transition-colors"
          >
            Make Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
