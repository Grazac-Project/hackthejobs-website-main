import {
  fincraPayment,
  fincraWebinarCheckoutData,
  getSingleWebinar,
  webinarReg,
} from "@/api/authentication/auth";
import { Load } from "@/components/loading";
import useFincraPayment from "@/lib/fincraCheckout";
import { getCurrencySymbol } from "@/Utils/currency-formatter";
import { formatPrice } from "@/Utils/price-formater";
import { MailOutline } from "@mui/icons-material";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaCalendarDays } from "react-icons/fa6";
import { IoIosArrowRoundBack } from "react-icons/io";
import { toast, ToastContainer } from "react-toastify";
import PaystackPop from "@paystack/inline-js";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { extractFirstParagraph } from "@/Utils/stringUtils";
function useCountdown(targetDate) {
  const target = useMemo(() => new Date(targetDate).getTime(), [targetDate]);
  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, target - Date.now())
  );

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(Math.max(0, target - Date.now()));
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const totalSeconds = Math.floor(timeLeft / 1000);
  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds, finished: totalSeconds === 0 };
}

const WebinarModal = ({ webinarId, token, provider, onClick, link }) => {
  const [webData, setWebData] = useState({});
  const [singleWebData, setSingleWebData] = useState({});
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { startPayment } = useFincraPayment();
  const [success, setSuccess] = useState(false);
  const [viewMoreLoading, setViewMoreLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState(false);
  const router = useRouter();

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
    setLoading(true);
    getSingleWebinar(webinarId, token)
      .then((res) => {
        setWebData(res.data?.data?.webinar);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err.response?.data?.message);
      });
  }, [webinarId, token]);

  // useEffect(() => {
  //   const prevHtmlOverflow = document.documentElement.style.overflow;
  //   const prevBodyOverflow = document.body.style.overflow;

  //   document.documentElement.style.overflow = "hidden";
  //   document.body.style.overflow = "hidden";

  //   return () => {
  //     document.documentElement.style.overflow = prevHtmlOverflow;
  //     document.body.style.overflow = prevBodyOverflow;
  //   };
  // }, []);
  console.log({ link });
  const startsAt = webData?.startTime;

  const { days, hours, minutes, seconds, finished } = useCountdown(startsAt);
  const handleRegister = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      firstName: fd.get("firstName"),
      lastName: fd.get("lastName"),
      email: fd.get("email"),
    };

    try {
      setSubmit(true);
      const res = await webinarReg(webinarId, payload, token);

      if (res) {
        // console.log("Registration success:", res.data?.data?.webinar);
        setSuccess(true);
        toast.success("Registration successful!");
        e.target.reset(); // clear form
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data?.message);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmit(false);
    }
  };
  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const data = {
        webinarId: webData._id,
        firstName: formValues.firstName,
        lastName: formValues.lastName,
        email: formValues.email,
        currency: webData.currency,
      };
      setSubmit(true);
      let reference;
      try {
        const res = await fincraWebinarCheckoutData(data, token);

        if (provider === "paystack") {
          console.log(res?.data?.data?.paystack);
          console.log("Payment via Paystack selected");
          console.log(
            "Payment Data:",
            res?.data?.data?.data?.paystack?.access_code
          );

          const accessCode = res?.data?.data?.data?.paystack?.access_code;

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
                setShowMain(true);
                setShowModal(false);
                setCheckout(false);
                setLoader(false);
                // setIsSuccess(true);
                successPaymentModal();
                setLoading("Make Payment");
              },
            });
            return;
          }
        }

        reference = res.data?.data?.payment?.reference;
        // console.log("reference", reference);
      } catch (err) {
        console.log(err);

        toast.error(
          err.response?.data?.message || "An error occurred. Please try again."
        );
        setSubmit(false);
        return;
      }
      const fullname = `${formValues.firstName} ${formValues.lastName}`;
      const result = await startPayment({
        price: webData.amount,
        currency: webData.currency,
        ref: reference,
        nameProp: fullname,
        emailProp: formValues.email,
        onSuccess: (data) => {
          setSuccess(true);
          const url = new URL(window.location.href);
          url.searchParams.set("ref", reference);
          window.history.replaceState({}, "", url.toString());
        },
        onClose: () => {
          toast.error("Transaction was not completed, window closed.");
        },
      });
    } catch (err) {
      console.error(err);
      setSubmit(false);
    }
  };
  const handleForeignPayment = async (e) => {
    e.preventDefault();
    const data = {
      webinarId: webData._id,
      firstName: formValues?.firstName,
      lastName: formValues?.lastName,
      email: formValues?.email,
      currency: webData?.currency,
    };
    fincraWebinarCheckoutData(data, token)
      .then((res) => {
        // console.log(res);
        setSubmit(false);
        // setShowBookingModal(true);
        const url = res.data.data.redirectUrl;
        window.location.href = url;
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Something went wrong");
        setSubmit(false);
      });
  };
  const handleclick = (e) => {
    e.preventDefault();
    setSubmit(true);

    if (
      webData?.type &&
      webData?.type.toLowerCase() === "paid" &&
      webData?.currency &&
      webData?.currency.toUpperCase() === "NGN"
    ) {
      handlePayment(e);
    } else if (
      webData?.type &&
      webData?.type.toLowerCase() === "paid" &&
      webData?.currency &&
      webData?.currency.toUpperCase() !== "NGN"
    ) {
      handleForeignPayment(e);
    } else {
      handleRegister(e);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleViewMore = () => {
    if (viewMoreLoading) return;

    setViewMoreLoading(true);
    router.push(link);
  };


  return (
    <div>
      <div
        className="bg-[#344054] opacity-70 w-[100%] h-full fixed z-50 top-0 left-[0] cursor-pointer"
        onClick={onClick}
      ></div>
      <ToastContainer />

      {success ? (
        <div className="bg-[#fff] w-[447px] h-[291px]  md:max-w-full p-8  flex flex-col items-center text-center rounded-[8px]  fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 overflow-y-auto">
          <Image src="/sucess.svg" width={57} height={57} alt="success" />
          <h3 className="font-medium  text-[24px] text-[#121927] leading-[11.71px] py-[16px]">
            Registered Successfully
          </h3>
          <p className="font-regular text-[16px] text-[#555555] leading-[24px] mb-[20px]">
            You have successfully registered for{" "}
            <span className="font-semibold">{webData?.title}</span> design
            webinar
          </p>
          <button
            className="min-w-[76px] h-[44px] rounded-[8px] border-[1px] px-[20px] py-[12px] font-medium bg-[#1453FF] text-[14px] text-[#fff] leading-[19.6px] tracking-[2%] mx-auto"
            onClick={onClick}
          >
            Done
          </button>
        </div>
      ) : (
        <div className="max-w-[52rem] h-fit sm:h-full max-h-[90%] sm:max-h-full mx-auto mt-10 sm:mt-0 px-14 py-20 sm:px-6 space-y-8 bg-[white] rounded-2xl sm:rounded-none fixed inset-0 z-50 overflow-y-auto ">
          <div className="flex items-center justify-between">
            <div className=" flex items-center text-sm leading-[150%] font-medium text-[#292D32] ">
              <button
                className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
                onClick={onClick}
              >
                <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
              </button>
              <span className="text-2xl font-semibold ml-4">Back</span>
            </div>
            {webData?.type !== "free" && (
              <select
                className="font-normal font-satoshi leading-[100%] tracking-[0] text-[12px] bg-[#F9FAFF] text-[#4F4F4F] border border-[#EAEAEA] px-[12px] py-[9.5px] rounded-[8px] outline-none cursor-pointer w-[79px]"
                value={webData?.currency}
                onChange={(e) => {
                  const selectedCurrency = e.target.value;
                  const pricingOption = webData?.pricing?.find(
                    (p) => p.currency === selectedCurrency
                  );
                  if (pricingOption) {
                    setWebData((prev) => ({
                      ...prev,
                      amount: pricingOption.amount,
                      currency: pricingOption.currency,
                    }));
                  }
                }}
              >
                {webData?.pricing?.map((price) => (
                  <option key={price._id} value={price.currency}>
                    {price.currency}
                  </option>
                ))}
              </select>
            )}

          </div>

          {/* Digital Products and webinar */}
          {loading ? (
            <Load />
          ) : (
            <div className="flex sm:flex-wrap gap-[35px] md:gap-4 ">
              <div className="mt-8 lg:mt-0 w-[602px] lg:w-[45%] md:w-full rounded-xl p-2 border-[1px] border-[#EDEDED] shadow-sm">
                <div className="overflow-hidden rounded-xl shadow-sm">
                  <img
                    src={webData?.thumbnail}
                    alt="Event poster"
                    className="h-[480px] w-full object-cover"
                  />
                </div>
              </div>

              {/* Right content */}
              <div className="flex flex-col gap-6 w-[55%] md:w-full">
                <div className="pt-10 lg:pt-2 ">
                  <h3 className="mb-2 font-semibold leading-[120%] text-[24px]  text-[#000000]">
                    {webData?.title}
                  </h3>
                  <p className="mt-3 text-[#787878] text-[14px] line-clamp-3">
                    {extractFirstParagraph(webData?.description)}
                  </p>
                  <button
                    onClick={handleViewMore}
                    // disabled={viewMoreLoading}
                    className={`mt-2 flex items-center gap-2 text-[14px] font-medium
                     ${viewMoreLoading
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-[#1453FF] hover:underline"
                      }`}>
                    {viewMoreLoading && (
                      <Image
                        src="/loader.gif"
                        width={14}
                        height={14}
                        alt="loading"
                      />
                    )}

                    {viewMoreLoading ? "Loading..." : "View more"}
                  </button>

                  {/* <button
                    onClick={() => router.push(link)}
                    className="mt-2 text-[#1453FF] text-[14px] font-medium hover:underline"
                  >
                    View more
                  </button> */}
                </div>

                {/* Event Details Card */}
                <div className="rounded-lg border border-[#EAEAEA] bg-[#FAFAFA] p-6">
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
                        {webData?.date
                          ? new Date(webData?.date).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "long",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                          : ""}
                      </p>
                      <p className="text-[12px] text-[#787878] mt-1">
                        Starts in {days} days
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
                        Google Meet
                      </p>
                      <p className="text-[12px] text-[#787878] mt-1">
                        Online session
                      </p>
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
                        {webData?.startTime
                          ? new Date(webData?.startTime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                          : ""}{" "}
                        -{" "}
                        {webData?.endTime
                          ? new Date(webData?.endTime).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )
                          : ""}
                      </p>
                      <p className="text-[12px] text-[#787878] mt-1">
                        45 mins duration
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-[24px] font-semibold text-[#000000]">
                    {webData?.type !== "free"
                      ? `${getCurrencySymbol(webData?.currency)}${formatPrice(
                        webData?.amount
                      )}`
                      : "Free"}
                  </div>
                  <button
                    disabled={loading || submit || finished}
                    className="rounded-lg bg-[#1453FF] px-6 py-3 text-[white] font-medium text-[14px] leading-5 cursor-pointer shadow hover:bg-[#0d36cc] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {finished
                      ? "Event Closed"
                      : webData?.type === "free"
                        ? "Join Webinar"
                        : submit
                          ? "Redirecting.."
                          : "Make Payment"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WebinarModal;

function TimeBox({ value, label }) {
  const padded = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-[#DCE5FF] p-[6px] py-3 w-[53px] shadow-sm">
      <div className="text-[16px]  font-semibold tabular-nums text-[#292D32] leading-[19.51px]">
        {padded}
      </div>
      <div className="mt-1 text-[8px] font-semibold leading-[100%] tracking-[2.44px] text-[#333333]">
        {label}
      </div>
    </div>
  );
}

function LabeledInput({
  name,
  type = "text",
  placeholder,
  icon,
  value,
  onChange,
}) {
  return (
    <label className="group relative flex items-center gap-2 rounded-lg  border border-[#EAEAEA]  bg-[white]  text-[#828282] ">
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full h-full  border-0 bg-transparent p-4 text-sm placeholder:text-slate-400 "
        required
        value={value}
        onChange={onChange}
      />
    </label>
  );
}
