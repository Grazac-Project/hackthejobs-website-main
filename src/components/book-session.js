"use client";

import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BookingsSubmitAction,
  fincraBookingCheckoutData,
  fincraPayment,
  getAvailableBookings,
  MentorshipPackageSubmitAction,
  MentorshipPaidPackageAction,
  paystackPayment,
} from "@/api/authentication/auth";
import Cookies from "js-cookie";
import { MdKeyboardArrowRight } from "react-icons/md";
import { MdKeyboardArrowLeft } from "react-icons/md";
import useFincraPayment from "@/lib/fincraCheckout";
import { Load } from "./loading";
import PaystackPop from "@paystack/inline-js";
import { extractFirstParagraph } from "@/Utils/stringUtils";
import { formatPrice } from "@/Utils/price-formater";
import { getCurrencySymbol } from "@/Utils/currency-formatter";

const BookSession = ({
  closeModal,
  mentorId,
  image,
  type,
  bookingCurrency,
  price,
  successModal,
  mentor,
  sessionType,
  setBookingModal,
  setCheckout,
  setShowMain,
  setCheckoutCallback,
  slot,
  setSlot,
  setLoadingState,
  provider,
  bookingSlug,
  productPricing,
  setProductPrice,
  setProductCurrency,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [activeDates, setActiveDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [bookingData, setBookingData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [bookingValues, setBookingValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [values, setValues] = useState({ suggestion: "" });
  const [buttonText, setButtonText] = useState("Book Session");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [token, setToken] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [loader, setLoader] = useState(false);
  const [clickedDate, setClickedDate] = useState("");
  const [ref, setRef] = useState("");
  const { startPayment } = useFincraPayment();
  const [currentPrice, setCurrentPrice] = useState(price);
  const [currentCurrency, setCurrentCurrency] = useState(bookingCurrency);

  useEffect(() => {
    setCurrentPrice(price);
    setCurrentCurrency(bookingCurrency);
  }, [price, bookingCurrency]);

  const handleCurrencyChange = (e) => {
    const selectedCurrency = e.target.value;
    const pricingOption = productPricing?.find(
      (p) => p.currency === selectedCurrency
    );

    if (pricingOption) {
      setCurrentCurrency(selectedCurrency);
      setCurrentPrice(pricingOption.amount);
      if (setProductCurrency) setProductCurrency(selectedCurrency);
      if (setProductPrice) setProductPrice(pricingOption.amount);
    } else {
      setCurrentCurrency(selectedCurrency);
      if (setProductCurrency) setProductCurrency(selectedCurrency);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  let userId;
  let userFirstName;
  let userLastName;
  let userEmail;

  try {
    let details = Cookies.get("user_details");
    // console.log(details);
    userId = JSON.parse(details).id;
    userFirstName = JSON.parse(details).name;
    userLastName = JSON.parse(details).lastName;
    userEmail = JSON.parse(details).email;
  } catch (err) {
    //err
  }

  useEffect(() => {
    try {
      let details = Cookies.get("user_details");
      setToken(JSON.parse(details).token);
    } catch (err) {
      //err
    }
  }, []);
  // console.log(setSlot)
  useEffect(() => {
    setLoader(true);
    // console.log({ type });
    // console.log({price });
    if (type && type.toLowerCase() === "paid") {
      setButtonText("Proceed to payment");
    }

    getAvailableBookings(mentorId)
      .then((res) => {
        setAvailableSessions(res.data.data.allAvailableSessions);
        setBookingData(res.data.data);
        const dateData = res.data.data.allAvailableSessions.map(
          (session) => session.date
        );
        // const dateData = res.data.data.allAvailableSessions.map((session => session.date ))
        const uniqueDateData = [...new Set(dateData)];

        setActiveDates(uniqueDateData);
        setLoader(false);
      })
      .catch((err) => {
        toast.error(err.response?.data?.error || "An error occurred");
        console.log(err);
        closeModal();
      });
  }, [type]);
  const handleDayClick = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setClickedDate(formattedDate);
    // console.log("Clicked Date:", formattedDate);
    // console.log("Active Dates:", activeDates);

    if (activeDates.includes(formattedDate)) {
      // console.log("Valid Date Selected:", date);
      setSelectedDate(date);
      fetchAvailableTimes(date);
    } else {
      console.log("Invalid Date Selected");
      setAvailableTimes([]);
      setShowButton(false);
    }
  };
  const fetchAvailableTimes = (date) => {
    // console.log("Selected Date:", date);

    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;

    // console.log("Formatted Date:", formattedDate);
    // console.log("Available Sessions:", availableSessions);

    const filterArr = availableSessions.filter((item) => {
      // console.log("Session Date:", item.date);
      return item.date === formattedDate;
    });

    const times = filterArr.map((value) => value.startTime);

    // console.log("Filtered Times:", times);

    setFilteredData(filterArr);
    setAvailableTimes(times);
  };

  const tileClassName = ({ date, view }) => {
    if (view === "month") {
      const formattedDate = dayjs(date).format("YYYY-MM-DD");

      const isActive = activeDates.includes(formattedDate);
      const isSelected =
        selectedDate && dayjs(date).isSame(selectedDate, "date");

      if (isSelected) return "selected-date";
      if (isActive) return "highlighted-date";
    }

    return "";
  };

  const handleTimeSelected = (time, index) => {
    setSelectedTimeIndex(index);
    setShowButton(true);
    const data = filteredData[index];
    setBookingValues(data);

    setSlot(data);
    // console.log("Selected slot object:", data);
    // setBookingData(prev => ({ ...prev, time }));
  };
  const handleBookingSubmit = (x) => {
    const data = {
      // bookingId: bookingValues?.bookingId,
      bookingId: slot?.bookingId,
      // slotId: bookingValues?.slotId,
      slotId: slot?.slotId,
      userId: mentorId,
      // suggestion: values.suggestion,
      ...x,
    };
    BookingsSubmitAction(data)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setLoadingState(false);
        // setShowBookingModal(true);
        setShowMain(true);
        setCheckout(false);
        closeModal();
        successModal();
      })
      .catch((err) => {
        // console.log(err);
        setLoadingState(false);
        setShowMain(true);
        setCheckout(false);
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };
  const handleMentorshipPackageSubmit = (x) => {
    const data = {
      packageId: slot?.bookingId,
      slotId: slot?.slotId,
      userId: mentorId,
      // suggestion: values.suggestion,
      ...x,
    };
    // console.log(data);
    MentorshipPackageSubmitAction(data)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setLoadingState(false);
        // setShowBookingModal(true);
        setShowMain(true);
        setCheckout(false);
        closeModal();
        successModal();
      })
      .catch((err) => {
        // console.log(err);
        setLoadingState(false);
        setShowMain(true);
        setCheckout(false);
        closeModal();
        toast.error(err.response?.data?.message);
        setLoading(false);
      });
  };
  const handleMentorshipPaidPackage = async (x) => {
    const data = {
      packageId: slot?.bookingId,
      slotId: slot?.slotId,
      userId: mentorId,
      // suggestion: values.suggestion,
      ...x,
    };
    try {
      const res = await MentorshipPaidPackageAction(data, token);
      // console.log(res);

      const payload = res?.data?.data || {};
      const reference = payload.reference;
      const firstname = payload.firstName || payload.first_name || "";
      const lastname = payload.lastName || payload.last_name || "";
      const fullname = `${firstname} ${lastname}`.trim();
      const email = payload.email || payload.emailAddress || "";

      setLoading(false);
      setLoadingState(false);
      setLoading(false);
      setLoadingState(false);
      if (currentCurrency.toUpperCase() === "NGN") {
        if (provider === "paystack") {
          console.log(payload);
          console.log("Payment via Paystack selected");
          console.log("Payment Data:", payload.paystack?.access_code);

          const accessCode = payload.paystack?.access_code;

          if (accessCode) {
            console.log("Paystack Access Code.......:", accessCode);
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode, {
              onCancel: () => {
                console.log("this is being cancelled...");
              },
              onError: () => {
                console.log(" error");
              },
              onLoad: () => {
                console.log("this is being loaded..");
              },
              onSuccess: () => {
                setLoadingState(false);
                setShowMain(true);
                setCheckout(false);
                closeModal();
                successModal();
              },
            });
            return;
          }
        }
        if (reference) {
          const url = new URL(window.location.href);
          url.searchParams.set("ref", reference);
          window.history.replaceState({}, "", url.toString());
        }

        await startPayment({
          price: Number(currentPrice),
          currency: String(currentCurrency).toUpperCase(),
          ref: reference,
          nameProp: fullname,
          emailProp: email,
          onSuccess: (data) => {
            setLoadingState(false);
            setShowMain(true);
            setCheckout(false);
            closeModal();
            successModal();
          },
          onClose: () => {
            setLoadingState(false);
            toast.error("Transaction was not completed, window closed.");
          },
        });
      } else {
        const url = res.data.data.checkoutUrl;
        window.location.href = url;
      }
      // persist ref in URL
    } catch (error) {
      console.log(error);
      setShowMain(true);
      setCheckout(false);
      closeModal();
      toast.error(error.response?.data?.error);
      setLoading(false);
    }
  };

  const handlePayment = async (x) => {
    delete x.productId;
    try {
      const data = {
        bookingId: slot?.bookingId,
        slotId: slot?.slotId,
        // suggestion: values.suggestion,
        currency: currentCurrency,
        ...x,
      };

      const res = await fincraBookingCheckoutData(data, token);
      const payload = res?.data?.data || {};

      const reference = payload.reference;
      const firstname = payload.firstName || payload.first_name || "";
      const lastname = payload.lastName || payload.last_name || "";
      const fullname = `${firstname} ${lastname}`.trim();
      const email = payload.email || payload.emailAddress || "";

      setLoading(false);
      setLoadingState(false);
      if (provider === "paystack") {
        console.log(payload);
        console.log("Payment via Paystack selected");
        console.log("Payment Data:", payload.paystack?.access_code);

        const accessCode = payload.paystack?.access_code;

        if (accessCode) {
          console.log("Paystack Access Code.......:", accessCode);
          const popup = new PaystackPop();
          popup.resumeTransaction(accessCode, {
            onCancel: () => {
              console.log("this is being cancelled...");
            },
            onError: () => {
              console.log(" error");
            },
            onLoad: () => {
              console.log("this is being loaded..");
            },
            onSuccess: () => {
              setLoadingState(false);
              setShowMain(true);
              setCheckout(false);
              closeModal();
              successModal();
            },
          });
          return;
        }
      }
      // persist ref in URL
      if (reference) {
        const url = new URL(window.location.href);
        url.searchParams.set("ref", reference);
        window.history.replaceState({}, "", url.toString());
      }

      await startPayment({
        price: Number(currentPrice),
        currency: String(currentCurrency).toUpperCase(),
        ref: reference,
        nameProp: fullname,
        emailProp: email,
        onSuccess: (data) => {
          setLoadingState(false);
          setShowMain(true);
          setCheckout(false);
          closeModal();
          successModal();
        },
        onClose: () => {
          setLoadingState(false);
          toast.error("Transaction was not completed, window closed.");
        },
      });
    } catch (err) {
      // console.error(err);
      setLoadingState(false);
      setShowMain(true);
      setCheckout(false);
      closeModal();
    }
  };
  const handleForeignPayment = (x) => {
    // console.log(slot);
    const data = {
      bookingId: slot?.bookingId,
      slotId: slot?.slotId,
      userId: mentorId,
      // suggestion: values.suggestion,
      amount: currentPrice,
      currency: currentCurrency,
      ...x,
    };
    // fincraPayment(data, token)
    fincraBookingCheckoutData(data, token)
      .then((res) => {
        // console.log(res);
        setLoading(false);
        setLoadingState(false);
        // setShowBookingModal(true);
        const url = res.data.data.checkoutUrl;
        window.location.href = url;
      })
      .catch((err) => {
        // console.log(err);
        setLoadingState(false);
        setShowMain(true);
        setCheckout(false);
        closeModal();
        toast.error(err.response?.data?.error);
        setLoading(false);
      });
  };
  const handleShowCheckout = () => {
    setShowMain(false);
    setBookingModal(false);
    setCheckout(true);
  };

  const handleclick = (val) => {
    setLoading(true);

    if (type && type.toLowerCase() === "paid" && sessionType === "mentorship") {
      handleMentorshipPaidPackage(val);
    } else if (
      type &&
      type.toLowerCase() === "free" &&
      sessionType === "mentorship"
    ) {
      handleMentorshipPackageSubmit(val);
    } else if (
      type &&
      type.toLowerCase() === "paid" &&
      currentCurrency === "NGN"
    ) {
      handlePayment(val);
    } else if (
      type &&
      type.toLowerCase() === "paid" &&
      currentCurrency !== "NGN"
    ) {
      handleForeignPayment(val);
    } else {
      handleBookingSubmit(val);
    }
  };

  useEffect(() => {
    setCheckoutCallback(
      () =>
        (...args) =>
          handleclick(...args)
    );
  }, [slot, currentPrice, currentCurrency]);

  return (
    <div>
      {/* <ToastContainer /> */}

      <div className="font-satoshi ">
        <div
          className="bg-[#344054] opacity-[0.7] w-[100%] h-[100vh] fixed z-50 top-0 left-[0]"
          onClick={closeModal}
        ></div>

        {isSuccess ? (
          <div className="bg-[#fff] w-[447px] h-[291px]  md:max-w-full p-8 sm:p-6 pb-[277px] sm:pb-[41px] flex flex-col items-center text-center rounded-[8px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
            <Image src="/sucess.svg" width={57} height={57} alt="success" />
            <h3 className="font-medium  text-[24px] text-[#121927] leading-[11.71px] py-[16px]">
              Session Booked
            </h3>
            <p className="font-regular text-[16px] text-[#555555] leading-[24px] mb-[20px]">
              Your booking with {mentor?.mentor?.firstName}{" "}
              {mentor?.mentor?.lastName} was successful. A confirmation email
              has been sent to your inbox.
            </p>
            <button
              className="w-[76px] h-[44px] rounded-[8px] border-[1px] px-[20px] py-[12px] font-medium bg-[#1453FF] text-[14px] text-[#fff] leading-[19.6px] tracking-[2%] mx-auto"
              onClick={closeModal}
            >
              Done
            </button>
          </div>
        ) : (
          <div className="h-full bg-[#fff] w-full max-w-[629px] md:max-w-full p-8 sm:p-3 pb-[277px] sm:pb-[41px] overflow-y-auto flex flex-col fixed top-0 right-0 z-50">

            <div className="flex items-center justify-between pb-[40px]">
              <div className="flex gap-[16px] items-center">
                <div
                  className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
                  onClick={closeModal}
                >
                  <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
                </div>
                <h1 className="font-medium text-[18px] leading-[27px] tracking-[3%] text-[#121927]">
                  Book Session
                </h1>
              </div>

              <select
                className="font-normal font-satoshi leading-[100%] tracking-[0] text-[12px] bg-[#F9FAFF] text-[#4F4F4F] border border-[#EAEAEA] px-[12px] py-[9.5px] rounded-[8px] outline-none cursor-pointer w-[79px]"
                value={currentCurrency}
                onChange={handleCurrencyChange}
              >
                {productPricing && productPricing.length > 0 ? (
                  productPricing.map((pricing, index) => (
                    <option key={index} value={pricing.currency}>
                      {pricing.currency}
                    </option>
                  ))
                ) : (
                  <option value={currentCurrency}>{currentCurrency}</option>
                )}
              </select>
            </div>
            {loader ? (
              <Load />
            ) : (
              <div>
                <Image
                  src={image || "/dummyPic.svg"}
                  width={152}
                  height={152}
                  alt="profile photo"
                  className="object-cover rounded-[50%] w-[152px] sm:w-[112px] h-[152px] sm:h-[112px]"
                />
                <h2 className="font-medium text-[24px] text-[#101828] leading-[25.62px]  pt-[24px] pb-[8px]">
                  {bookingData.title || "Let’s talk about negotiations"}
                </h2>
                <p className="font-regular text-[16px] leading-[20.8px] text-[#7D7D7D] pb-[8px]">
                  {extractFirstParagraph(bookingData.description) ||
                    "The booking description goes here in full with lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare."}
                </p>
                <button
                  onClick={() => router.push(`${pathname}/${bookingSlug}`)}
                  className="mb-6 text-[#1453FF] text-[14px] font-medium hover:underline"
                >
                  View more
                </button>
                <div className="flex justify-between items-center">
                  <div className=" xxm:w-fit">
                    <h3 className="font-medium text-[16px] text-[#4F4F4F] leading-[19.2px] mb-[8px]">
                      Location
                    </h3>
                    <p className="font-regular text-[16px] text-[#7D7D7D] leading-[19.2px]">
                      Google Meet
                    </p>
                  </div>
                  <div className=" xxm:w-fit">
                    <h3 className="font-medium text-[16px] text-[#4F4F4F] leading-[19.2px] mb-[8px]">
                      Duration
                    </h3>
                    <p className="font-regular text-[16px] text-[#7D7D7D] leading-[19.2px]">
                      {bookingData.sessionDuration} mins
                    </p>
                  </div>
                  <div className=" xxm:w-fit">
                    <h3 className="font-medium text-[16px] text-[#4F4F4F] leading-[19.2px] mb-[8px]">
                      Timezone
                    </h3>
                    <p className="font-regular text-[16px] text-[#7D7D7D] leading-[19.2px]">
                      {bookingData.timezone}
                    </p>
                  </div>
                  {sessionType && (
                    <div className=" xxm:w-fit">
                      <h3 className="font-medium text-[16px] text-[#4F4F4F] leading-[19.2px] mb-[8px]">
                        Package Duration
                      </h3>
                      <p className="font-normal text-[16px] text-[#7D7D7D] leading-[19.2px]">
                        {bookingData.duration}{" "}
                        {bookingData.duration > 1 ? "Months" : "Month"}
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex flex-col  w-[100%] mt-[24px]">
                  <Calendar
                    onClickDay={handleDayClick}
                    tileClassName={tileClassName}
                    value={selectedDate}
                    className="!w-full max-w-xs mx-auto"
                    prevLabel={<MdKeyboardArrowLeft className="nav-icon" />}
                    nextLabel={<MdKeyboardArrowRight className="nav-icon" />}
                  />
                  {selectedDate && (
                    <>
                      <div className="mt-6 grid grid-cols-4 gap-4">
                        {availableTimes.map((time, index) => {
                          // console.log("Rendering Time:", time);
                          return (
                            <div
                              key={index}
                              style={{
                                background:
                                  selectedTimeIndex === index ? "#1453FF" : "",
                                color:
                                  selectedTimeIndex === index ? "#fff" : "",
                              }}
                              onClick={() => handleTimeSelected(time, index)}
                              className="bg-[#fff] text-[16px] xm:text-[12px] text-[#7D7D7D] hover:text-[#fff] text-center leading-[16px] py-[18.5px] px-6 sm:px-[14px] xm:px-[8px] sxm:px-[5px] border-[1px] border-[#D0D5DD] rounded-[8px] cursor-pointer hover:bg-[#1453FF]"
                            >
                              {time}
                            </div>
                          );
                        })}
                      </div>
                      <div className="w-[100%] mt-[40px]">
                        <h4 className="text-[14px] leading-[17px] font-[400] text-[#4F4F4F] mb-[8px] sm:mt-[12px]">
                          Do you have anything you'd like to share ahead of our
                          session ?{" "}
                          <span className="text-[#7D7D7D]">(Optional)</span>
                        </h4>
                        <textarea
                          type="text"
                          placeholder="Type here"
                          name="suggestion"
                          value={values.suggestion}
                          onChange={handleChange}
                          className="min-h-[70px] w-[100%] rounded-lg border text-[14px] leading-[17px] font-[400] font-inter border-[#EAEAEA] p-[16px] disabled:cursor-not-allowed"
                        />
                      </div>
                    </>
                  )}
                </div>
                {showButton && (
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-[#101828]">
                        {getCurrencySymbol(currentCurrency)}
                        {formatPrice(currentPrice)}
                      </span>
                    </div>
                    <button
                      onClick={handleShowCheckout}
                      className="font-medium flex justify-center items-center gap-1 text-[14px] leading-[19.6px] tracking-[2%] text-[#fff] bg-[#1453FF] border-[1px] border-[#1453FF] py-[12px] px-[20px] rounded-[8px] sm:flex mb-[16px] mt-[24px]"
                    >
                      {loading ? (
                        <Image
                          src="/loader.gif"
                          width={16}
                          height={16}
                          alt="loader"
                        />
                      ) : (
                        ""
                      )}
                      {buttonText}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSession;
