"use client";
import Navbar from "@/components/navbar/nav";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useParams, useRouter } from "next/navigation";
import ProductHero from "./ProductHero";
import ProductInfo from "./ProductInfo";
import ProductDetails from "./ProductDetails";
import ProductFooter from "./ProductFooter";
import Checkout from "@/components/checkout";
import Link from "next/link";
import { Load } from "@/components/loading";
import {
  fincraWebinarCheckoutData,
  getProductBySlug,
  webinarReg,
} from "@/api/authentication/auth";
import useFincraPayment from "@/lib/fincraCheckout";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import PaystackPop from "@paystack/inline-js";

const WebinarPage = () => {
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
  const [main , setMain] = useState(true);
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
    setMain(false)
    setCheckout(true);
  };

  const exitCheckout = () => {
    setCheckout(false);
    setMain(true)
    setSuccess(false);
  };
  const handleRegister = async (values) => {
    const payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
    };

    try {
      setLoader(true);
      const res = await webinarReg(productData?._id, payload, token);

      if (res) {
        setSuccess(true);
        setCheckout(false);
        toast.success("Registration successful!");
      }
    } catch (err) {
      console.error("Registration error:", err.response?.data?.message);
      toast.error(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoader(false);
    }
  };
  const handlePayment = async (values) => {
    try {
      const data = {
        webinarId: productData?._id,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        currency: productData?.currency,
      };
      setLoader(true);
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
                setMain(true);
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
      } catch (err) {
        console.log(err);
        toast.error(
          err.response?.data?.message || "An error occurred. Please try again."
        );
        setLoader(false);
        return;
      }

      const fullname = `${values.firstName} ${values.lastName}`;
      const result = await startPayment({
        price: productData?.amount,
        currency: productData?.currency,
        ref: reference,
        nameProp: fullname,
        emailProp: values.email,
        onSuccess: (data) => {
          setSuccess(true);
          setCheckout(false);
          const url = new URL(window.location.href);
          url.searchParams.set("ref", reference);
          window.history.replaceState({}, "", url.toString());
        },
        onClose: () => {
          toast.error("Transaction was not completed, window closed.");
          setLoader(false);
        },
      });
    } catch (err) {
      console.error(err);
      setLoader(false);
    }
  };
  const handleForeignPayment = async (values) => {
    const data = {
      webinarId: productData?._id,
      firstName: values?.firstName,
      lastName: values?.lastName,
      email: values?.email,
      currency: productData?.currency,
    };
    setLoader(true);
    fincraWebinarCheckoutData(data, token)
      .then((res) => {
        setLoader(false);
        const url = res.data.data.redirectUrl;
        window.location.href = url;
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response?.data?.message || "Something went wrong");
        setLoader(false);
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
      await handleRegister(values);
    }
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
          const productType = response.data.data.type; // "booking" or "webinar"
          setProvider(response.data.data?.provider);
          let mappedData;

          if (productType === "webinar") {
            // Map webinar response
            mappedData = {
              title: apiData.title,
              description: apiData.description,
              thumbnail:
                apiData.thumbnail || apiData.image || apiData.profilePic,
              date: apiData.date,
              startTime: apiData.startTime,
              endTime: apiData.endTime,
              location: apiData.meetLink || "Online",
              amount: apiData.amount || 0,
              currency: apiData.currency,
              type: apiData.type, // "free" or "paid"
              category: "Webinar",
              fullDescription: apiData.description,
              _id: apiData._id,
              productType: "webinar",
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
              amount: apiData.amount || 0,
              currency: apiData.currency,
              type: apiData.bookingType, // "free" or "paid"
              category: "Booking",
              fullDescription: apiData.description,
              availabilitySlots: apiData.availabilitySlots || [],
              sessionDuration: apiData.sessionDuration,
              _id: apiData._id,
              productType: "booking",
            };
          } else {
            setError("Unknown product type");
            return;
          }

          setProductData(mappedData);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <Load />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">{error || "Product not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F7]">
      <ToastContainer />
      <Link href="/">
        <div
          className="bg-[#ffff] rounded-md py-6 px-6"
        >
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
          {/* Back Button */}
          <div className="mb-8 flex items-center text-sm leading-[150%] font-medium text-[#292D32]">
            <button
              className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => router.back()}
            >
              <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
            </button>
            <span className="text-2xl font-semibold ml-4">Back</span>
          </div>

          {/* Main Content Card */}
          <div className="bg-[white] rounded-2xl p-8 md:p-6 sm:p-4 shadow-sm">
            {/* Product Hero and Info Section */}
            <div className="flex lg:flex-col gap-8 mb-8">
              <ProductHero
                thumbnail={productData.thumbnail}
                title={productData.title}
              />
              <ProductInfo
                title={productData.title}
                description={productData.description}
                date={productData.date}
                startTime={productData.startTime}
                endTime={productData.endTime}
                location={productData.location}
                amount={productData.amount}
                currency={productData.currency}
                type={productData.type}
                onMakePayment={openCheckout}
              />
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

export default WebinarPage;
