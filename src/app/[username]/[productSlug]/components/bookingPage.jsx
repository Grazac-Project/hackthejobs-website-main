"use client";
import Navbar from "@/components/navbar/nav";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import ProductDetails from "./ProductDetails";
import ProductFooter from "./ProductFooter";
import Checkout from "@/components/checkout";
import Link from "next/link";
import { Load } from "@/components/loading";
import {
  fincraWebinarCheckoutData,
  getProductBySlug,
  webinarReg,
  fincraBookingCheckoutData,
  BookingsSubmitAction,
  MentorshipPackageSubmitAction,
  MentorshipPaidPackageAction,
} from "@/api/authentication/auth";
import useFincraPayment from "@/lib/fincraCheckout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import PaystackPop from "@paystack/inline-js";
import Calendar from "react-calendar";
import dayjs from "dayjs";
import "react-calendar/dist/Calendar.css";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft } from "react-icons/md";
import Error from "@/components/error";

const BookingPage = () => {
  const params = useParams();
  const router = useRouter();
  const { username, productSlug } = params;

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState("");
  const [checkout, setCheckout] = useState(false);
  const [loader, setLoader] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { startPayment } = useFincraPayment();
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [provider, setProvider] = useState("");
  const [main, setMain] = useState(true);

  // New state for calendar and slots
  const [activeDates, setActiveDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedTimeIndex, setSelectedTimeIndex] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [requestNote, setRequestNote] = useState("");
  const [bookingValues, setBookingValues] = useState({});
  const [clickedDate, setClickedDate] = useState("");

  const handleChange = (e) => {
    setRequestNote(e.target.value);
  };

  // Get token from cookies
  useEffect(() => {
    const data = Cookies.get("user_details");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setToken(parsedData?.token || "");
      } catch (error) {
        console.error("Failed to parse token:", error);
      }
    }
  }, []);

  const openCheckout = () => {
    setMain(false);
    setCheckout(true);
  };

  const exitCheckout = () => {
    setCheckout(false);
    setMain(true);
    setSuccess(false);
  };
  const currencySymbols = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };

  // Calendar Logic
  const handleDayClick = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    setClickedDate(formattedDate);

    if (activeDates.includes(formattedDate)) {
      setSelectedDate(date);
      fetchAvailableTimes(date);
      setSelectedTimeIndex(null); // Reset time selection when date changes
    } else {
      setSelectedDate(null);
      setAvailableTimes([]);
      setSelectedTimeIndex(null);
    }
  };

  const fetchAvailableTimes = (date) => {
    const formattedDate = dayjs(date).format("YYYY-MM-DD");
    const slots = productData?.availabilitySlots || [];

    const filterArr = slots.filter((item) => item.date === formattedDate);
    const times = filterArr.map((value) => value.startTime);

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
    const data = filteredData[index];
    setBookingValues(data);
  };

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductBySlug(username, productSlug);
        console.log(response, "response");

        if (response.data && response.data.data && response.data.data.data) {
          const apiData = response.data.data.data;
          const mentorData = response.data.data.mentor;
          const productType = response.data.data.type; // "booking" or "webinar"
          setProvider(response.data.data?.provider);
          let mappedData;

          let displayAmount = apiData.amount || 0;
          let displayCurrency = apiData.currency;
          const pricingList = apiData.pricing || [];

          if ((!displayAmount || Number(displayAmount) === 0) && pricingList.length > 0) {
            const match = pricingList.find((p) => p.currency === displayCurrency);
            if (match) {
              displayAmount = match.amount;
              displayCurrency = match.currency;
            } else {
              displayAmount = pricingList[0].amount;
              displayCurrency = pricingList[0].currency;
            }
          }

          if (productType === "webinar") {
            // Map webinar response
            mappedData = {
              profilePic: apiData.profilePic,
              title: apiData.title,
              description: apiData.description,
              thumbnail:
                apiData.thumbnail || apiData.image || apiData.profilePic,
              date: apiData.date,
              startTime: apiData.startTime,
              endTime: apiData.endTime,
              location: apiData.meetLink || "Online",
              amount: displayAmount,
              currency: displayCurrency,
              pricing: apiData.pricing || [],
              type: apiData.type, // "free" or "paid"
              category: "Webinar",
              fullDescription: apiData.description,
              _id: apiData._id,
              productType: "webinar",
              firstName: mentorData.firstName,
              lastName: mentorData.lastName,
              mentorId: mentorData._id,
            };
          } else if (productType === "booking") {
            // Map booking response
            mappedData = {
              title: apiData.title,
              description: apiData.description,
              thumbnail: apiData.image || apiData.profilePic,
              // Get the first available slot for date/time info
              date: apiData.availabilitySlots?.[0]?.date || null,
              startTime: apiData.availabilitySlots?.[0]?.startTime
                ? `${apiData.availabilitySlots[0].date}T${apiData.availabilitySlots[0].startTime}:00Z`
                : null,
              endTime: apiData.availabilitySlots?.[0]?.endTime
                ? `${apiData.availabilitySlots[0].date}T${apiData.availabilitySlots[0].endTime}:00Z`
                : null,
              location: apiData.meetingLocation,
              timezone: apiData.timezone,
              amount: displayAmount,
              currency: displayCurrency,
              pricing: apiData.pricing || [],
              type: apiData.bookingType, // "free" or "paid"
              category: "Booking",
              fullDescription: apiData.description,
              availabilitySlots: apiData.availabilitySlots || [],
              sessionDuration: apiData.sessionDuration,
              _id: apiData._id,
              productType: "booking",
              firstName: mentorData.firstName,
              lastName: mentorData.lastName,
              profilePic: mentorData.profilePic,
              mentorId: mentorData._id,
            };
          } else {
            setError("Unknown product type");
            return;
          }

          setProductData(mappedData);

          // Populate active dates from availability slots
          if (mappedData.availabilitySlots) {
            const dates = mappedData.availabilitySlots.map((s) => s.date);
            const uniqueDates = [...new Set(dates)];
            setActiveDates(uniqueDates);
          }
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message ||
          "Failed to load product. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (username && productSlug) {
      fetchProductData();
    }
  }, [username, productSlug]);

  /* Payment Login */
  const handleBookingSubmit = (values) => {
    const data = {
      bookingId: productData._id,
      slotId: bookingValues?._id,
      userId: productData?.mentorId,
      suggestion: requestNote,
      ...values,
    };

    // Log the data being sent
    console.log("Submitting booking with data:", data);

    setLoader(true);
    BookingsSubmitAction(data)
      .then((res) => {
        setLoader(false);
        setCheckout(false);
        setMain(true);
        setSuccess(true);
        toast.success("Booking successful!");
      })
      .catch((err) => {
        setLoader(false);
        setCheckout(false);
        setMain(true);
        toast.error(err.response?.data?.message || "Booking failed");
      });
  };

  const handleMentorshipPackageSubmit = (values) => {
    // Check if we have the necessary data
    if (!productData?.mentorId) {
      toast.error("Mentor ID is missing. Cannot proceed.");
      return;
    }

    const data = {
      packageId: bookingValues?.bookingId || productData._id,
      slotId: bookingValues?.slotId,
      userId: productData?.mentorId,
      suggestion: requestNote,
      ...values,
    };
    setLoader(true);
    MentorshipPackageSubmitAction(data)
      .then((res) => {
        setLoader(false);
        setCheckout(false);
        setMain(true);
        setSuccess(true);
        toast.success("Package booked successfully!");
      })
      .catch((err) => {
        setLoader(false);
        setCheckout(false);
        setMain(true);
        toast.error(err.response?.data?.message || "Package booking failed");
      });
  };

  const handleMentorshipPaidPackage = async (values) => {
    const data = {
      packageId: bookingValues?.bookingId || productData._id,
      slotId: bookingValues?.slotId,
      userId: productData?.mentorId,
      suggestion: requestNote,
      ...values,
    };

    try {
      setLoader(true);
      const res = await MentorshipPaidPackageAction(data, token);
      const payload = res?.data?.data || {};
      const reference = payload.reference;

      const firstname =
        payload.firstName || payload.first_name || values.firstName;
      const lastname = payload.lastName || payload.last_name || values.lastName;
      const fullname = `${firstname} ${lastname}`.trim();
      const email = payload.email || payload.emailAddress || values.email;

      if (productData.currency.toUpperCase() === "NGN") {
        if (provider === "paystack") {
          const accessCode = payload.paystack?.access_code;
          if (accessCode) {
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode, {
              onCancel: () => {
                setLoader(false);
              },
              onError: () => {
                setLoader(false);
                toast.error("Payment Error");
              },
              onSuccess: () => {
                setLoader(false);
                setCheckout(false);
                setMain(true);
                setSuccess(true);
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
          price: Number(productData.amount),
          currency: String(productData.currency).toUpperCase(),
          ref: reference,
          nameProp: fullname,
          emailProp: email,
          onSuccess: (data) => {
            setLoader(false);
            setCheckout(false);
            setMain(true);
            setSuccess(true);
          },
          onClose: () => {
            setLoader(false);
            toast.error("Transaction was not completed, window closed.");
          },
        });
      } else {
        setLoader(false);
        const url = payload.checkoutUrl || payload.redirectUrl;
        if (url) window.location.href = url;
      }
    } catch (error) {
      console.error(error);
      setLoader(false);
      setCheckout(false);
      setMain(true);
      toast.error(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Payment initialization failed"
      );
    }
  };

  const handlePayment = async (values) => {
    // For normal bookings (not packages)
    const data = {
      bookingId: productData._id,
      slotId: bookingValues?._id,
      suggestion: requestNote,
      currency: values?.currency || productData.currency,
      amount: values?.amount || productData.amount,
      ...values,
    };
    delete data.productId;

    try {
      setLoader(true);
      const res = await fincraBookingCheckoutData(data, token);
      const payload = res?.data?.data || {};
      const reference = payload.reference;

      const firstname =
        payload.firstName || payload.first_name || values.firstName;
      const lastname = payload.lastName || payload.last_name || values.lastName;
      const fullname = `${firstname} ${lastname}`.trim();
      const email = payload.email || payload.emailAddress || values.email;

      if (provider === "paystack") {
        const accessCode = payload.paystack?.access_code;
        if (accessCode) {
          const popup = new PaystackPop();
          popup.resumeTransaction(accessCode, {
            onCancel: () => setLoader(false),
            onError: () => {
              setLoader(false);
              toast.error("Payment Error");
            },
            onSuccess: () => {
              setLoader(false);
              setCheckout(false);
              setMain(true);
              setSuccess(true);
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
        price: Number(values?.amount || productData.amount),
        currency: String(
          values?.currency || productData.currency
        ).toUpperCase(),
        ref: reference,
        nameProp: fullname,
        emailProp: email,
        onSuccess: (data) => {
          setLoader(false);
          setCheckout(false);
          setMain(true);
          setSuccess(true);
        },
        onClose: () => {
          setLoader(false);
          toast.error("Transaction was not completed, window closed.");
        },
      });
    } catch (err) {
      console.error("Booking Payment Error:", err);
      setLoader(false);
      setCheckout(false);
      setMain(true);
      toast.error(
        err?.response?.data?.message || "Payment initialization failed"
      );
    }
  };

  const handleForeignPayment = async (values) => {
    const data = {
      bookingId: productData._id,
      slotId: bookingValues?._id,
      userId: productData?.mentorId,
      suggestion: requestNote,
      amount: values?.amount || productData.amount,
      currency: values?.currency || productData.currency,
      ...values,
    };

    setLoader(true);
    fincraBookingCheckoutData(data, token)
      .then((res) => {
        setLoader(false);
        const url =
          res.data.data.checkoutUrl ||
          res.data.data.redirectUrl ||
          res.data.data.paystack.authorization_url;
        if (provider === "paystack") {
          const accessCode = res.data.data?.paystack?.access_code;
          if (accessCode) {
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode, {
              onCancel: () => setLoader(false),
              onError: () => {
                setLoader(false);
                toast.error("Payment Error");
              },
              onSuccess: () => {
                setLoader(false);
                setCheckout(false);
                setMain(true);
                setSuccess(true);
              },
            });
            return;
          }
        }
        if (url) window.location.href = url;
      })
      .catch((err) => {
        console.error(err);
        setLoader(false);
        setCheckout(false);
        setMain(true);
        toast.error(
          err.response?.data?.error ||
          err.response?.data?.message ||
          "Foreign payment failed"
        );
      });
  };

  const checkoutCallback = (val) => {
    setLoader(true);
    if (
      productData?.type &&
      productData?.type.toLowerCase() === "paid" &&
      productData?.sessionType === "mentorship"
    ) {
      handleMentorshipPaidPackage(val);
    } else if (
      productData?.type &&
      productData?.type.toLowerCase() === "free" &&
      productData?.sessionType === "mentorship"
    ) {
      handleMentorshipPackageSubmit(val);
    } else if (
      productData?.type &&
      productData?.type.toLowerCase() === "paid" &&
      productData?.currency === "NGN"
    ) {
      handlePayment(val);
    } else if (
      productData?.type &&
      productData?.type.toLowerCase() === "paid" &&
      productData?.currency !== "NGN"
    ) {
      handleForeignPayment(val);
    } else {
      handleBookingSubmit(val);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <Load />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <>
        <Error text={error || "Product not found"} path={`/${username}`} />
      </>
    );
  }
  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <ToastContainer />
      <Link href="/">
        <div className="bg-[#ffff] rounded-md py-6 px-6">
          <Image
            src="/prooval-logo.svg"
            width={100.44}
            height={36}
            alt="Prooval logo"
          />
        </div>
      </Link>
      {main && (
        <div className="max-w-[1102px] mx-auto mt-10 mb-10 px-6">
          {/* Main Content Card */}
          <div className="bg-[white] rounded-2xl p-8 md:p-6 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-[35px]">
              <div
                onClick={() => router.push(`/${username}`)}
                className="flex items-center gap-[12px]  p-[8px] rounded-[8px] bg-[#FAFAFA] w-[210px] xm:w-[168px] whitespace-nowrap cursor-pointer border border-[#EDEDED] truncate sxm:hidden"
              >
                <Image
                  src={productData.profilePic}
                  alt="profilepics"
                  width={32}
                  height={32}
                />
                <div className="flex flex-col">
                  <p className="text-[12px] text-[#101828] mb-[2px] font-normal">
                    Listed by
                  </p>
                  <p className="text-[16px] text-[#101828] xm:text-[12px] font-medium truncate">
                    {productData.firstName} {productData.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm leading-[150%] font-medium text-[#292D32] sxm:block 3xl:hidden">
                <button
                  className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
                  onClick={() => router.push(`/${username}`)}
                >
                  <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
                </button>
                <span className="text-2xl font-semibold ml-2">Back</span>
              </div>

              {productData?.type && productData.type.toLowerCase() === "paid" && (
                <select
                  className="font-normal font-satoshi leading-[100%] tracking-[0] text-[12px] bg-[#F9FAFF] text-[#4F4F4F] border border-[#EAEAEA] px-[12px] py-[9.5px] rounded-[8px] outline-none cursor-pointer w-[79px]"
                  value={productData?.currency}
                  onChange={(e) => {
                    const selectedCurrency = e.target.value;
                    const pricingOption = productData?.pricing?.find(
                      (p) => p.currency === selectedCurrency
                    );
                    if (pricingOption) {
                      setProductData((prev) => ({
                        ...prev,
                        amount: pricingOption.amount,
                        currency: pricingOption.currency,
                      }));
                    }
                  }}
                >
                  {productData?.pricing?.map((price) => (
                    <option key={price._id} value={price.currency}>
                      {price.currency}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {/* Product Hero and Info Section */}
            <h2 className="font-medium text-[24px] text-[#101828] leading-[25.62px] mb-[24px]">
              {productData.title || "-"}
            </h2>

            <div className="flex lg:flex-col gap-8 ">
              <div className="w-1/2 lg:w-full ">
                <div className="flex justify-between items-center md:flex-col gap-4 mb-[10px]">
                  <div className="bg-[#F9FAFB] w-full flex flex-col items-start rounded-lg p-3">
                    <h3 className="text-xs text-[#4F4F4F] flex items-start gap-1 mb-1">
                      <i>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5.33301 1.33334V4.00001"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M10.667 1.33334V4.00001"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M12.6667 2.66666H3.33333C2.59695 2.66666 2 3.26361 2 3.99999V13.3333C2 14.0697 2.59695 14.6667 3.33333 14.6667H12.6667C13.403 14.6667 14 14.0697 14 13.3333V3.99999C14 3.26361 13.403 2.66666 12.6667 2.66666Z"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M2 6.66666H14"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </i>
                      Time Zone
                    </h3>
                    <p className="text-sm font-medium text-[#101828]">
                      {productData.timezone}
                    </p>
                  </div>
                  <div className="bg-[#F9FAFB] w-full flex flex-col items-start rounded-lg p-3">
                    <h3 className="text-xs text-[#4F4F4F] flex items-center gap-1 mb-1">
                      <i>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M13.3337 6.66668C13.3337 9.99534 9.64099 13.462 8.40099 14.5327C8.28548 14.6195 8.14486 14.6665 8.00033 14.6665C7.85579 14.6665 7.71518 14.6195 7.59966 14.5327C6.35966 13.462 2.66699 9.99534 2.66699 6.66668C2.66699 5.25219 3.2289 3.89563 4.22909 2.89544C5.22928 1.89525 6.58584 1.33334 8.00033 1.33334C9.41481 1.33334 10.7714 1.89525 11.7716 2.89544C12.7718 3.89563 13.3337 5.25219 13.3337 6.66668Z"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M8 8.66666C9.10457 8.66666 10 7.77123 10 6.66666C10 5.56209 9.10457 4.66666 8 4.66666C6.89543 4.66666 6 5.56209 6 6.66666C6 7.77123 6.89543 8.66666 8 8.66666Z"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </i>
                      Location
                    </h3>
                    <p className="text-sm font-medium text-[#101828]">
                      {productData.location || "Google Meet"}
                    </p>
                  </div>
                  <div className="bg-[#F9FAFB] w-full flex flex-col items-start rounded-lg p-3">
                    <h3 className="text-xs text-[#4F4F4F] flex items-center gap-1 mb-1">
                      <i>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M8 4V8L10.6667 9.33333"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M7.99967 14.6667C11.6816 14.6667 14.6663 11.6819 14.6663 8.00001C14.6663 4.31811 11.6816 1.33334 7.99967 1.33334C4.31778 1.33334 1.33301 4.31811 1.33301 8.00001C1.33301 11.6819 4.31778 14.6667 7.99967 14.6667Z"
                            stroke="#909090"
                            stroke-width="1.33333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </i>
                      Duration
                    </h3>
                    <p className="text-sm font-medium text-[#101828]">
                      {productData.sessionDuration || 45} mins
                    </p>
                  </div>
                </div>
                <Calendar
                  onClickDay={handleDayClick}
                  tileClassName={tileClassName}
                  value={selectedDate}
                  className="!w-full border-none"
                  prevLabel={<MdKeyboardArrowLeft className="text-xl" />}
                  nextLabel={<MdKeyboardArrowRight className="text-xl" />}
                />
              </div>

              <div className="w-1/2 lg:w-full pl-6 lg:pl-0 flex flex-col">
                <div className="w-full h-full overflow-y-auto flex flex-col  border border-[#EAEAEA] bg-[#FAFAFA] rounded-2xl py-6 px-4">
                  {availableTimes.length > 0 ? (
                    <>
                      <h3 className="font-medium text-[14px] text-[#344054] mb-4">
                        Available Slots
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        {availableTimes.map((time, index) => (
                          <button
                            key={index}
                            onClick={() => handleTimeSelected(time, index)}
                            className={`py-4 px-3 text-xs border rounded-lg transition-colors ${selectedTimeIndex === index
                              ? "bg-[#1453FF] text-[white] border-2 border-[#1453FF] shadow-[0_0_0_2px_#BEDBFF]"
                              : "bg-[white] text-[#344054] border-[#D0D5DD] hover:border-[#1453FF]"
                              }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>

                      <div className="">
                        <label className="block text-sm  text-[#344054] mb-2 ">
                          Any special requests?
                        </label>
                        <textarea
                          value={requestNote}
                          onChange={handleChange}
                          placeholder="Type here..."
                          className="w-full h-24 p-3 border border-[#D0D5DD] rounded-lg text-sm resize-none focus:outline-none focus:ring-1 focus:ring-[#1453FF]"
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-[#292D32] max-w-[213px] text-center flex items-center justify-center m-auto  h-full">Select a date to view the available time slots</p>
                  )}
                </div>

                <div className="w-full flex justify-between items-center border border-[#EAEAEA] bg-[#FAFAFA] rounded-2xl p-6 mt-8">
                  <div>
                    <span className="text-lg font-bold text-[#101828]">
                      {productData?.type && productData.type.toLowerCase() === "free" ? "Free" : `${currencySymbols[productData.currency] || productData.currency}${productData.amount?.toLocaleString()}`}
                    </span>
                  </div>
                  <button
                    onClick={() => openCheckout()}
                    disabled={selectedTimeIndex === null}
                    className={`px-6 py-2 rounded-lg text-sm font-medium text-[white] transition-colors ${selectedTimeIndex !== null
                      ? "bg-[#1453FF] hover:bg-blue-700"
                      : "bg-gray-300 cursor-not-allowed"
                      }`}
                  >
                    Make Payment
                  </button>
                </div>
              </div>
            </div>

            {/* Product Details Section */}
            <ProductDetails fullDescription={productData.fullDescription} />
          </div>

          {/* Footer */}
          <ProductFooter />
        </div>
      )}
      {success && (
        <div className="bg-[#fff] w-[447px] h-[291px] md:max-w-full p-8 flex flex-col items-center text-center rounded-[8px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto shadow-lg">
          <Image src="/sucess.svg" width={57} height={57} alt="success" />
          <h3 className="font-medium text-[24px] text-[#121927] leading-[11.71px] py-[16px]">
            {productData?.type === "paid"
              ? "Payment Successful"
              : "Registered Successfully"}
          </h3>
          <p className="font-regular text-[16px] text-[#555555] leading-[24px] mb-[20px]">
            You have successfully{" "}
            {productData?.type === "paid" ? "purchased" : "registered for"}{" "}
            <span className="font-semibold">{productData?.title}</span>
          </p>
          <button
            className="min-w-[76px] h-[44px] rounded-[8px] border-[1px] px-[20px] py-[12px] font-medium bg-[#1453FF] text-[14px] text-[#fff] leading-[19.6px] tracking-[2%] mx-auto"
            onClick={() => setSuccess(false)}
          >
            Done
          </button>
        </div>
      )}
      {success && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSuccess(false)}
        />
      )}
      {checkout && productData && (
        <Checkout
          setLoader={setLoader}
          loader={loader}
          goBack={exitCheckout}
          checkoutCallback={checkoutCallback}
          productId={productSlug}
          productDescription={productData.title}
          productPrice={productData.amount}
          productCurrency={productData.currency}
          productType={productData.type}
          category={productData.category}
        />
      )}
    </div>
  );
};

export default BookingPage;
