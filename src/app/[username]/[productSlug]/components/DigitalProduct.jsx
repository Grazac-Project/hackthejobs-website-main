"use client";
import useFincraPayment from "@/lib/fincraCheckout";
import { formatPrice } from "@/Utils/price-formater";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiDownload, FiEye } from "react-icons/fi";
import PaystackPop from "@paystack/inline-js";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  fincraDigitalCheckoutData,
  getProductBySlug,
  initializeDigitalProductPayment,
} from "@/api/authentication/auth";
import { Load } from "@/components/loading";
import Checkout from "@/components/checkout";

const DigitalProduct = () => {
  const params = useParams();
  const router = useRouter();
  const { username, productSlug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [seller, setSeller] = useState(null);
  const [provider, setProvider] = useState("");
  const [productData, setProductData] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const [loader, setLoader] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { startPayment } = useFincraPayment();
  const [success, setSuccess] = useState(false);
  const [freeMode, setFreeMode] = useState(false);
  const [token, setToken] = useState("");
  const [main, setMain] = useState(true);

  const isProduction = process.env.NEXT_PUBLIC_DOMAIN_DEV;
  const baseUrl =
    isProduction === "development"
      ? "https://test-dashboard.hackthejobs.com"
      : "https://dashboard.hackthejobs.com";

  const openCheckout = () => {
    setMain(false);
    setCheckout(true);
  };

  const exitCheckout = () => {
    setCheckout(false);
    setMain(true);
    setSuccess(false);
  };

  // Fetch product data from API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProductBySlug(username, productSlug);

        if (response.data && response.data.data && response.data.data.data) {
          const apiData = response.data.data.data;
          const seller = response.data.data?.mentor;
          const productType = response.data.data.type; // "booking" or "webinar"
          setProvider(response.data.data?.provider);
          let mappedData;
          // console.log("FULL RESPONSE:", response);
          console.log(apiData, "apiData");
          setSeller(seller);
          setProduct(apiData);
          setProductData(apiData); // Fix: Set productData so it's available for payment
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.log(err);
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

  const handleAccessProduct = async (values) => {
    try {
      setLoading(true);

      const payload = {
        productId: productData?._id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        currency: productData?.currency || "NGN",
      };

      console.log("Free Product Payload:", payload);

      const res = await initializeDigitalProductPayment(payload, token);

      console.log("Free Product Response:", res.data);

      setLoading(false);
      setSuccess(true)
      setFreeMode(true)
      // successPaymentModal();
      setCheckout(false);
      setMain(true);

    } catch (error) {
      console.log("initializeDigitalProductPayment error:", error);
      toast.error(error?.response?.data?.message || "Failed to process free product");
      setLoading(false);
    }
  };

  const handlePayment = async (values) => {
    console.log("handlePayment initiated with values:", values);
    console.log("Product Data:", productData);
    console.log("Provider:", provider);

    try {
      const data = {
        productId: productData?._id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        currency: productData?.currency,
        amount: productData?.amount, // Ensure amount is passed
      };
      setLoading(true); // User preferred full screen loader
      let reference;

      try {
        console.log("Calling fincraDigitalCheckoutData with:", data);
        // Reverting to fincraDigitalCheckoutData as this is DigitalProduct.jsx
        const res = await fincraDigitalCheckoutData(data, token);
        console.log("fincraDigitalCheckoutData response:", res);

        if (provider === "paystack") {
          console.log("Payment provider is Paystack");
          console.log("Paystack Data:", res?.data?.data?.paystack);

          const accessCode = res?.data?.data?.data?.paystack?.access_code;
          console.log("Paystack Access Code:", accessCode);

          if (accessCode) {
            const popup = new PaystackPop();
            popup.resumeTransaction(accessCode, {
              onCancel: () => {
                console.log("Paystack transaction cancelled");
                setLoading(false);
              },
              onError: (error) => {
                console.log("Paystack transaction error:", error);
                setLoading(false);
                toast.error("Payment failed. Please try again.");
              },
              onLoad: () => {
                console.log("Paystack widget loaded");
              },
              onSuccess: () => {
                console.log("Paystack transaction successful");
                setMain(true);
                setCheckout(false);
                setLoading(false);
                setSuccess(true)
                // successPaymentModal();
              },
            });
            return;
          } else {
            console.error("No access code found for Paystack");
            toast.error("Could not initialize Paystack payment.");
            setLoading(false);
            return;
          }
        }

        reference = res.data?.data?.payment?.reference;
        console.log("Fincra Reference:", reference);

        if (!reference) {
          console.error("No reference returned from API for Fincra");
          console.log("Full Response Data:", res.data?.data);
        }
      } catch (err) {
        console.error("Error in checkout data call:", err);
        toast.error(
          err.response?.data?.message ||
          "An error occurred initializing payment."
        );
        setLoading(false);
        return;
      }

      if (!reference && provider !== "paystack") {
        console.error("Cannot proceed with Fincra payment without reference");
        toast.error("Payment initialization failed. No reference.");
        setLoading(false);
        return;
      }

      const fullname = `${values.firstName} ${values.lastName}`;
      console.log("Starting Fincra payment with:", {
        price: productData?.amount,
        currency: productData?.currency,
        ref: reference,
        nameProp: fullname,
        emailProp: values.email,
      });

      const result = await startPayment({
        price: productData?.amount,
        currency: productData?.currency,
        ref: reference,
        nameProp: fullname,
        emailProp: values.email,
        onSuccess: (data) => {
          console.log("Fincra payment success:", data);
          setSuccess(true);
          setCheckout(false);
          const url = new URL(window.location.href);
          url.searchParams.set("ref", reference);
          window.history.replaceState({}, "", url.toString());
        },
        onClose: () => {
          console.log("Fincra modal closed");
          toast.info("Payment window closed.");
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("Error in handlePayment:", err);
      toast.error("An unexpected error occurred.");
      setLoading(false);
    }
  };
  const handleForeignPayment = async (values) => {
    console.log("handleForeignPayment initiated with:", values);
    const data = {
      productId: productData?._id,
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      currency: productData?.currency,
    };
    console.log("Foreign payment data:", data);
    setLoading(true);
    fincraDigitalCheckoutData(data, token)
      .then((res) => {
        console.log("fincraDigitalCheckoutData success:", res);
        setLoading(false);
        const url = res.data.data.redirectUrl;
        if (url) {
          console.log("Redirecting to:", url);
          window.location.href = url;
        } else {
          console.error("No redirect URL found in response");
          toast.error("Failed to initiate foreign payment.");
        }
      })
      .catch((err) => {
        console.error("fincraDigitalCheckoutData error:", err);
        toast.error(err.response?.data?.message || "Something went wrong");
        setLoading(false);
      });
  };
  const checkoutCallback = async (values) => {
    // values = { firstName, lastName, email, productId, currency }
    console.log("Checkout callback triggered with:", values);

    if (
      productData?.type &&
      productData?.type.toLowerCase() === "paid" &&
      productData?.currency &&
      productData?.currency.toUpperCase() === "NGN"
    ) {
      await handlePayment(values);
    } else if (
      productData?.type &&
      productData?.type.toLowerCase() === "paid" &&
      productData?.currency &&
      productData?.currency.toUpperCase() !== "NGN"
    ) {
      await handleForeignPayment(values);
    } else {
      await handleAccessProduct(values);
    }
  };

  const handleClose = () => {
    const isProduction = process.env.NEXT_PUBLIC_DOMAIN_DEV;

    window.location.href =
      isProduction === "development"
        ? `${process.env.NEXT_PUBLIC_STAGING_DASH_URL}/digital-products`
        : `${process.env.NEXT_PUBLIC_DASH_URL}/digital-products`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Product not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F2F2F7] font-satoshi">
      {success && (
        //  Success Modal
        <div className="bg-[#fff] w-[447px] h-[291px] md:max-w-full p-8 sm:p-6 pb-[277px] sm:pb-[41px] flex flex-col items-center text-center rounded-[8px] fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Image src="/sucess.svg" width={57} height={57} alt="success" />
          <h3 className="font-medium text-[24px] text-[#121927] leading-[11.71px] py-[16px]">
            {freeMode ? "You’re all set!" : "Purchase successful"}
          </h3>
          <p className="font-regular text-[16px] text-[#555555] leading-[24px] mb-[20px]">
            {freeMode
              ? `${product.title} has been added to your dashboard. You can access it anytime`
              : "You can now access your purchase"}
          </p>
          <button
            className="min-w-[76px] h-[44px] rounded-[8px] border-[1px] px-[20px] py-[12px] font-medium bg-[#1453FF] text-[14px] text-[#fff] leading-[19.6px] tracking-[2%] mx-auto"
            onClick={handleClose}
          >
            View Product
          </button>
        </div>
      )}
      <Link href="/">
        <div className="bg-[#ffff] rounded-md py-6 px-[80px] md:px-[40px] xm:px-[16px]">
          <Image
            src="/prooval-logo.svg"
            width={100.44}
            height={36}
            alt="Prooval logo"
          />
        </div>
      </Link>
      {main && !success && (
        <div className="mx-[169px] mt-[40px] lgx:mx-[100px] md:mx-[40px] xm:mx-[16px]">
          <div className="bg-[#fff] px-[56px] py-[24px] rounded-2xl lgx:px-[32px] xm:px-3">
            <div className="flex items-center justify-between mb-[35px]">
              <div
                onClick={() => router.push(`/${username}`)}
                className="flex items-center gap-[12px]  p-[8px] rounded-[8px] bg-[#FAFAFA] w-[210px] xm:w-[168px] whitespace-nowrap cursor-pointer border border-[#EDEDED] truncate sxm:hidden">
                <Image
                  src={product?.profilePic}
                  alt="profilepics"
                  width={32}
                  height={32}
                />
                <div className="flex flex-col">
                  <p className="text-[12px] text-[#101828] mb-[2px] font-normal">Listed by</p>
                  <p className="text-[16px] text-[#101828] xm:text-[12px] font-medium truncate">
                    {seller?.firstName} {seller?.lastName}
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

              <select
                className="font-normal font-satoshi leading-[100%] tracking-[0] text-[12px] bg-[#F9FAFF] text-[#4F4F4F] border border-[#EAEAEA] px-[12px] py-[9.5px] rounded-[8px] outline-none cursor-pointer w-[79px]"
                value={product?.currency}
                onChange={(e) => {
                  const selectedCurrency = e.target.value;
                  const pricingOption = product?.pricing?.find(
                    (p) => p.currency === selectedCurrency
                  );
                  if (pricingOption) {
                    setProduct((prev) => ({
                      ...prev,
                      amount: pricingOption.amount,
                      currency: pricingOption.currency,
                    }));
                    setProductData((prev) => ({
                      ...prev,
                      amount: pricingOption.amount,
                      currency: pricingOption.currency,
                    }));
                  }
                }}
              >
                {product?.pricing?.map((price) => (
                  <option key={price._id} value={price.currency}>
                    {price.currency}
                  </option>
                ))}
              </select>
            </div>

            {/* Product Details */}
            <div className="flex gap-[16px] xm:flex-col lg:flex-col md:flex-col  ">
              <div className="border p-2 border-[#EDEDED] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
                <div
                  className="h-[479px] w-[458px] rounded-lg bg-cover bg-center lgx:w-[411px] md:w-[100%] lg:w-full"
                  style={{ backgroundImage: `url(${product?.thumbnail})` }}
                />
              </div>
              <div className="flex flex-col w-[516px] lgx:w-[411px] md:w-[100%] lg:w-full">
                <h3 className="text-[24px] font-semibold mb-4 truncate xm:text-[20px] xm:font-bold sxm:text-[16px] ">
                  {product?.title || "Digital Product"}
                </h3>
                <div className="flex items-center gap-[10px] mb-[12px]">
                  <span className="text-xs bg-[#DEA8061A] text-[#DEA806] px-3 py-1 rounded-[32px] font-medium">
                    {product?.category || ""}
                  </span>
                  <button className="flex items-center gap-[4.87px] bg-[#3333331A] rounded-[38.96px] py-[5.37px] px-[14.61px] sxm:px-3 cursor-none">
                    {product?.accessType ? (
                      <FiDownload className="text-[#333333]" />
                    ) : (
                      <FiEye className="text-[#333333]" />
                    )}
                    <p className="font-medium text-xs text-[#333333]">
                      {product?.accessType ? "Download" : "View Only"}
                    </p>
                  </button>
                </div>
                <hr className="border border-[#EAEAEA] " />

                <div className="text-sm font-normal tracking-[0.08em] mt-4 text-[#333333] h-[216px]">
                  {product?.description || ""}
                </div>
                <div className="flex justify-between items-center border border-[#EAEAEA] bg-[#FAFAFA] p-[16px] rounded-[8px] mt-[99px] xm:fixed xm:bottom-0 xm:left-0 xm:right-0 xm:z-50 xm:w-full">
                  <div className="text-[18px] font-bold text-[#333333]">
                    {product?.type === "paid"
                      ? `${product.currency === "NGN" ? "₦" : "$"}${formatPrice(
                        product?.amount
                      )}`
                      : "Free"}
                  </div>
                  <button
                    className="text-sm text-[#fff] bg-primary px-3 py-[10px] w-[182px] xxm:w-[120px] rounded-[6.29px] font-bold truncate"
                    // onClick={handleClick}
                    onClick={openCheckout}
                  >
                    {product?.type === "paid" ? "Make Payment" : "Access Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#fff] mt-[10px] px-[56px] py-[40px] rounded-2xl lgx:px-[32px] xm:px-3">
            <div>
              <div>
                <h1 className="font-bold text-[24px] text-[#333333] pb-[12px] border-b border-[#EAEAEA]">
                  Details
                </h1>
              </div>

              <div
                className="pt-[16px] text-[14px] font-normal text-[#333333] leading-[160%] space-y-4"
                dangerouslySetInnerHTML={{ __html: product?.description }}
              />
            </div>
          </div>

          <div className="font-satoshi minmd:flex-row minmd:justify-between minmd:items-center text-center  flex flex-col justify-center px-[56px] py-[32px] md:px-[32px] sm:mb-[70px] ">
            <div className="flex items-center gap-1 sm:pb-[10px] sm:justify-center">
              <p className="minmd:mb-0 text-[20px] uppercase text-[#878787]">
                Powered by
              </p>
              <img
                src="/footer-logo1.svg"
                alt="prooval-logo"
                className="w-[53px] h-[19px]"
              />
            </div>
            <Link
              href={
                isProduction === "development"
                  ? `${process.env.NEXT_PUBLIC_STAGING_DASH_URL}/auth/signup`
                  : `${process.env.NEXT_PUBLIC_DASH_URL}/auth/signup`
              }
            >
              <button className="bg-[#000] text-[#fff] px-14 py-4 items-center rounded-lg sxm:px-6">
                Create my own page
              </button>
            </Link>
          </div>
        </div>
      )}

      {checkout && product && (
        <Checkout
          setLoader={setLoading}
          loader={loading}
          goBack={exitCheckout}
          checkoutCallback={checkoutCallback}
          productId={productSlug}
          productDescription={product.title}
          productPrice={product.amount}
          productCurrency={product.currency}
          productType={product.type}
          category={product.category}
        />
      )}
    </div>
  );
};

export default DigitalProduct;
