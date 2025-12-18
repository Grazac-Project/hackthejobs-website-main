"use client";
import {
  fincraDigitalCheckoutData,
  initializeDigitalProductPayment,
} from "@/api/authentication/auth";
import useFincraPayment from "@/lib/fincraCheckout";
import { formatPrice } from "@/Utils/price-formater";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiDownload, FiEye } from "react-icons/fi";
import PaystackPop from "@paystack/inline-js";
import { useRouter } from "next/navigation";
import { extractFirstParagraph } from "@/Utils/stringUtils";

const Payment = ({
  onClick,
  productId,
  productType,
  productPrice,
  productCurrency,
  productThumbnail,
  productTitle,
  category,
  accessType,
  productDescription,
  setShowModal,
  setCheckout,
  setShowMain,
  setCheckoutCallback,
  successModal,
  setLoader,
  successPaymentModal,
  makeFree,
  provider,
  productSlug,
  expertSlug,
  productPricing,
  setProductPrice,
  setProductCurrency
}) => {
  const [loading, setLoading] = useState("Access Product");
  const [freeMode, setFreeMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { startPayment } = useFincraPayment();
  const [showCheckout, setShowCheckout] = useState(false);
  const router = useRouter();

  const [viewMoreLoading, setViewMoreLoading] = useState(false);

  const [currentPrice, setCurrentPrice] = useState(productPrice);
  const [currentCurrency, setCurrentCurrency] = useState(productCurrency);

  useEffect(() => {
    setCurrentPrice(productPrice);
    setCurrentCurrency(productCurrency);
  }, [productPrice, productCurrency]);

  useEffect(() => {
    // Prefetch product details page so routing is instant
    if (expertSlug && productSlug) {
      router.prefetch(`/${expertSlug}/${productSlug}`);
    }
  }, [expertSlug, productSlug]);

  // Set button label based on product type
  console.log({ productSlug })
  useEffect(() => {
    console.log("Provider in Payment component:", provider);
    if (productType === "paid") setLoading("Make Payment");
    else setLoading("Access Product");
  }, [productType]);

  useEffect(() => {
    // console.log("Payment component mounted");
  }, []);
  useEffect(() => {
    // console.log("isSuccess changed:", isSuccess);
  }, [isSuccess]);

  // Handle free product access
  const handleAccessProduct = (z) => {
    try {
      setLoading("Initiating access ...");
      const data = { productId, ...z };

      initializeDigitalProductPayment(data)
        .then((res) => {
          setLoader(false);
          setCheckout(false);
          setIsSuccess(true);
          setFreeMode(true);
          setShowMain(true);
          setShowModal(false);
          // setIsSuccess(true);
          // successModal();
          successPaymentModal();
          makeFree();
        })
        .catch((err) => {
          // console.log(err);
          setLoader(false);
          setShowMain(true);
          setShowModal(false);
          toast.error(err.response?.data?.message || "Something went wrong");
          setLoading("Access Product");
        });
    } catch (err) {
      // console.error(err);
      setLoading("Access Product");
    }
  };

  const handlePayment = async (x) => {
    try {
      setLoading("Initiating payment ...");
      console.log(currentCurrency)

      const payload = { productId, currency: currentCurrency };

      const res = await fincraDigitalCheckoutData(x);

      if (provider === "paystack") {
        console.log(res?.data?.data?.data?.paystack);
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

      const reference =
        res?.data?.data?.data?.reference ?? res?.data?.data?.reference;

      if (!reference) throw new Error("Missing payment reference from server");

      // Save reference to URL (optional)
      const url = new URL(window.location.href);
      url.searchParams.set("ref", reference);
      window.history.replaceState({}, "", url.toString());

      const fullname = `${x.firstName} ${x.lastName}`;
      // Trigger Fincra payment modal
      await startPayment({
        price: Number(currentPrice),
        currency: String(currentCurrency || "NGN").toUpperCase(),
        ref: reference,
        nameProp: fullname,
        emailProp: x.email,
        onSuccess: () => {
          setShowMain(true);
          setShowModal(false);
          setCheckout(false);
          setLoader(false);
          // setIsSuccess(true);
          successPaymentModal();
          setLoading("Make Payment");
        },
        onClose: () => {
          setLoading("Make Payment");
          setLoader(false);
          toast.error("Transaction was not completed, window closed.");
        },
      });
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Payment failed";
      setShowMain(true);
      setShowModal(false);
      setCheckout(false);
      toast.error(msg);
      // console.error(err);
    } finally {
      setLoading("Make Payment");

      setLoader(false);
    }
  };

  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);
  // Handle international payment (non-NGN)
  const handleForeignPayment = (y) => {
    try {
      setLoading("Initiating payment ...");
      const data = { productId, ...y };

      initializeDigitalProductPayment(data)
        .then((res) => {
          const url = res.data.data.redirectUrl;
          setLoader(false);
          if (url) window.location.href = url;
          else throw new Error("No redirect URL found");
        })
        .catch((err) => {
          setShowMain(true);
          setShowModal(false);
          setCheckout(false);
          setLoader(false);
          toast.error(err.response?.data?.error || "Something went wrong");
          setLoading("Make Payment");
        });
    } catch (err) {
      // console.error(err);
      setLoading("Make Payment");
      setLoader(false);
    }
  };

  const handleShowCheckout = () => {
    // Update parent state with current selected values
    if (setProductPrice) setProductPrice(currentPrice);
    if (setProductCurrency) setProductCurrency(currentCurrency);

    setShowMain(false);
    setShowModal(false);
    setCheckout(true);
  };
  // Handle all click types
  const handleClick = (val) => {
    if (productType === "paid" && currentCurrency === "NGN") {
      handlePayment(val);
    } else if (productType === "paid" && currentCurrency !== "NGN") {
      handleForeignPayment(val);
    } else {
      handleAccessProduct(val);
    }
  };

  useEffect(() => {
    setCheckoutCallback(
      () =>
        (...args) =>
          handleClick(...args)
    );
  }, [currentCurrency, currentPrice, productType]);


  const currencySymbols = {
    NGN: "₦",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  // Redirect to dashboard after success
  const handleClose = () => {
    const isProduction = process.env.NEXT_PUBLIC_DOMAIN_DEV;

    window.location.href =
      isProduction === "development"
        ? `${process.env.NEXT_PUBLIC_STAGING_DASH_URL}/digital-products`
        : `${process.env.NEXT_PUBLIC_DASH_URL}/digital-products`;
  };

  const handleViewMore = () => {
    if (viewMoreLoading) return;

    setViewMoreLoading(true);
    router.push(`/${expertSlug}/${productSlug}`);
  };

  // function truncateString(str) {
  //   if (typeof str !== "string") return "";
  //   if (str.length <= 30) return str;
  //   return str.slice(0, 30) + "...";
  // }
  return (
    <div className="font-satoshi">
      {/* Overlay background */}
      <div
        className="bg-[#344054] opacity-[0.7] w-[100%] h-full fixed z-50 top-0 left-[0]"
        onClick={onClick}
      ></div>

      <ToastContainer />

      {isSuccess ? (
        // ✅ Success Modal
        <div className="bg-[#fff] w-[447px] h-[291px] md:max-w-full p-8 sm:p-6 pb-[277px] sm:pb-[41px] flex flex-col items-center text-center rounded-[8px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Image src="/sucess.svg" width={57} height={57} alt="success" />
          <h3 className="font-medium text-[24px] text-[#121927] leading-[11.71px] py-[16px]">
            {freeMode ? "You’re all set!" : "Purchase successful"}
          </h3>
          <p className="font-regular text-[16px] text-[#555555] leading-[24px] mb-[20px]">
            {freeMode
              ? `${productTitle} has been added to your dashboard. You can access it anytime`
              : "You can now access your purchase"}
          </p>
          <button
            className="min-w-[76px] h-[44px] rounded-[8px] border-[1px] px-[20px] py-[12px] font-medium bg-[#1453FF] text-[14px] text-[#fff] leading-[19.6px] tracking-[2%] mx-auto"
            onClick={handleClose}
          >
            View Product
          </button>
        </div>
      ) : (
        // 💳 Payment Modal
        <div className="w-[1005px] px-[56px] sm:w-full h-[90%] sm:h-[90%] mx-auto mt-10 sm:mt-5 sm:p-4 p-14 space-y-8 bg-[white] rounded-2xl sm:rounded-none fixed inset-0 z-50 overflow-y-auto lgx:w-[90%] md:w-[75%] xm:w-[100%] ">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-sm leading-[150%] font-medium text-[#292D32]">
              <button
                className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
                onClick={onClick}
              >
                <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
              </button>
              <span className="text-2xl font-semibold ml-4">Back</span>
            </div>
            {productType === "paid" && (
              <select
                className="font-normal font-satoshi leading-[100%] tracking-[0] text-[12px] bg-[#F9FAFF] text-[#4F4F4F] border border-[#EAEAEA] px-[12px] py-[9.5px] rounded-[8px] outline-none cursor-pointer w-[79px]"
                value={currentCurrency}
                onChange={(e) => {
                  const selected = productPricing?.find((p) => p.currency === e.target.value);
                  if (selected) {
                    setCurrentPrice(selected.amount);
                    setCurrentCurrency(selected.currency);
                  } else if (!productPricing || productPricing.length === 0) {
                    // Fallback if no pricing array, although logic implies we shouldn't be here if valid options are shown
                    setCurrentCurrency(e.target.value)
                  }
                }}
              >
                {productPricing && productPricing.length > 0 ? (
                  productPricing.map((price, index) => (
                    <option key={index} value={price.currency}>
                      {price.currency}
                    </option>
                  ))
                ) : (
                  <option value={productCurrency}>{productCurrency}</option>
                )}
              </select>
            )}
          </div>

          {/* Product Details */}
          <div className="flex gap-[16px] lg:flex-col">
            <div className="border p-2 border-[#EDEDED] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer md:w-[475px] xm:w-[100%] lg:w-full">
              <div
                className="h-[479px] w-[458px] rounded-lg bg-cover bg-center xm:w-[100%] lg:w-full"
                style={{ backgroundImage: `url(${productThumbnail})` }}
              />
            </div>
            <div className="flex flex-col w-[411px] xm:w-[100%] lg:w-full">
              <h3 className="text-[24px] font-semibold mb-4 truncate xm:text-[20px]">
                {productTitle || "Digital Product"}
              </h3>
              <div className="flex items-center gap-[10px] mb-[12px]">
                <span className="text-xs bg-[#DEA8061A] text-[#DEA806] px-3 py-1 rounded-[32px] font-medium">
                  {category || ""}
                </span>
                <button className="flex items-center gap-[4.87px] bg-[#3333331A] rounded-[38.96px] py-[5.37px] px-[14.61px] sxm:px-3 cursor-none">
                  {accessType ? (
                    <FiDownload className="text-[#333333]" />
                  ) : (
                    <FiEye className="text-[#333333]" />
                  )}
                  <p className="font-medium text-xs text-[#333333]">
                    {accessType ? "Download" : "View Only"}
                  </p>
                </button>
              </div>
              <hr className="border border-[#EAEAEA] " />

              <div className="text-sm font-normal tracking-[0.08em] mt-4 text-[#333333] flex flex-col items-start h-[216px]">
                <p>
                  {extractFirstParagraph(productDescription) || ""}
                </p>
                <button
                  onClick={handleViewMore}
                  disabled={viewMoreLoading}
                  className={`mt-2 flex items-center gap-2 text-[14px] font-medium
                  ${viewMoreLoading
                      ? "text-[#000] cursor-not-allowed"
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
                  onClick={() => { router.push(`/${expertSlug}/${productSlug}`) }}
                  className="text-primary underline mt-[16px]"
                >
                  View more
                </button> */}

              </div>
              <div className="flex justify-between items-center border border-[#EAEAEA] bg-[#FAFAFA] p-[16px] rounded-[8px] mt-[99px] xm:fixed xm:bottom-0 xm:left-0 xm:right-0 xm:z-50 xm:w-full">
                <div className="text-[18px] font-bold text-[#333333]">
                  {productType === "paid"
                    ? `${currencySymbols[currentCurrency] || currentCurrency}${formatPrice(currentPrice)}`
                    : "Free"}
                </div>
                <button
                  className="text-sm text-[#fff] bg-primary px-3 py-[10px] w-[182px] xxm:w-[120px] rounded-[6.29px] font-bold truncate"
                  // onClick={handleClick}
                  onClick={handleShowCheckout}
                >
                  {loading}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;
