"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import BookingModal from "./booking-modal";
import BookSession from "./book-session";
import Cookies from "js-cookie";
import { getAllBookings} from "@/api/authentication/auth";
import { formatPrice } from "@/Utils/price-formater";
import { getCurrencySymbol } from "@/Utils/currency-formatter";



const MentorSession = ({ closeSessionModal, mentorId, mentorImage, mentorDetails }) => {
  const [loading, setLoading] = useState(false);
  const [showBookSession, setShowBookSession] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [token, setToken] = useState();
  const [mentorData, setMentorData] = useState([]);
  const [bookingData, setBookingData] = useState([]);
  const [bookingId, setBookingId] = useState(mentorId);
  const [bookType, setBookType] = useState("");
  const [mentorPrice, setMentorPrice] = useState("")
  const [currency , setCurrency] = useState("")
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const data = Cookies.get("user_details");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setToken(parsedData?.token);
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }
  }, []);

  const bookSession = (id, type, amount, bookingCurrency) => {
    if (token) {
      setBookingId(id);
      setBookType(type);
      setMentorPrice(amount);
      setCurrency(bookingCurrency);

      setShowBookSession(true);


    } else {
      window.location.href = "https://dashboard.hackthejobs.com/auth/signup";
    }
  };
  useEffect(() => {
    setLoading(true);
    getAllBookings(mentorId)
      .then((res) => {
        // console.log(res);
        setMentorData(res.data.data.mentor);
        setBookingData(res.data.data.bookings);

        // console.log(mentorData);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || "Network error !!!");
        closeSessionModal();
        // console.log(err)
      });
  }, []);
  const openModal = () => {
    setShowBookingModal(true);
    // closeSessionModal();
  };
  const closeSesModal = () => {
    setShowBookSession(false);
    closeSessionModal();
  };

  return (
    <div>
      <ToastContainer />
      {showSuccessModal && (
        <BookingModal
          mentorId={bookingId}
          mentor={mentorDetails}
          closeModal={closeSesModal}


        />
      )}
      <>
        {showBookSession ? (
          <BookSession
            mentorId={bookingId}
            image={mentorImage}
            closeModal={() => setShowBookSession(false)}
            successModal={openModal}
            type={bookType}
            price={mentorPrice}
            mentor={mentorDetails}
            bookingCurrency={currency}
          />
        ) : (
          <div className="font-satoshi">
            <div
              className="bg-[#344054] opacity-[0.7] w-[100%] h-full fixed z-50 top-0 left-[0]"
              onClick={closeSessionModal}
            ></div>
            <div className="h-full bg-[#F2F2F7] w-full max-w-[629px] md:max-w-full p-8 sm:p-3 pb-[277px] sm:pb-[41px] overflow-y-auto flex flex-col fixed top-0 right-0 z-50">
              <div className="pb-[40px] flex gap-[16px] items-center">
                <div
                  className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
                  onClick={closeSessionModal}
                >
                  <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
                </div>
                <h1 className="font-medium text-[18px] leading-[27px] tracking-[3%] text-[#121927]">
                  Available Session(s)
                </h1>
              </div>
              {loading ? (
                <>
                  <Image
                    src="/loader.gif"
                    width={24}
                    height={24}
                    alt="loading..."
                    unoptimized
                    className="  w-auto m-auto flex justify-center items-center "
                  />
                </>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  {bookingData.map((bookings) => (
                    <div  key={bookings.bookingId} className="flex flex-col gap-[10px] w-full h-[211px] py-[24px] px-[12px] bg-[white] rounded-[8px] ]">
                      <div className="flex gap-[16px] justify-between items-center ">
                        <div
                          className={`w-[61px] h-[22px] rounded-full flex items-center justify-center ${
                            bookings?.type === "Paid"
                            ? " bg-[#DEA8061A]"
                            : " bg-[#3333331A]"
                            }`}
                        >
                          {bookings?.type === "Paid" && (
                            <Image
                              src="/paid.svg"
                              alt="mentor"
                              width={12}
                              height={12}
                              className="w-[12px] h-[12px] rounded-full"
                            />
                          )}
                          <span
                            className={` text-[12px] font-medium leading-[18px] font-inter ${
                              bookings?.type === "Paid"
                              ? "text-[#F3B704]"
                              : "text-[#333333]"
                              } `}
                          >
                            {bookings?.type}
                          </span>
                        </div>
                        {bookings?.type === "Paid" && (
                          <div className=" flex items-center gap-1 justify-center">
                            <Image
                              src="/wallet.svg"
                              alt="mentor"
                              width={12}
                              height={12}
                              className="w-[12px] h-[12px] "
                            />

                            <span className="text-[#333333] text-[14px] font-bold leading-[140%] font-inter ">
                              {getCurrencySymbol(bookings.currency)}{formatPrice(bookings?.amount)}
                            </span>
                          </div>
                        )}
                      </div>
                      <h4 className="text-[#333333] text-[14px] font-bold leading-[140%] font-inter">
                        {bookings?.title}
                      </h4>
                      <p className="text-[#4F4F4F] text-[14px] font-normal leading-[140%] font-inter line-clamp-2">
                        {bookings?.description}
                      </p>
                      <div className=" flex justify-between items-center">
                        <p className="text-[#4F4F4F] text-[14px] font-normal leading-[140%] font-inter">
                          {bookings?.sessionDuration} mins
                        </p>
                        <button
                          className=" w-[130px]  h-[50.43px] leading-[150%] text-[12.57px] text-[#ffff]  bg-primary rounded-[6.29px] "
                          onClick={() => bookSession(bookings?.bookingId, bookings?.type, bookings?.amount, bookings.currency)}
                        >
                          Book Mentor
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </>

      {/* <BookingModal/> */}
    </div>
  );
};

export default MentorSession;
