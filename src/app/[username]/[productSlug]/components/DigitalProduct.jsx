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
import { fincraDigitalCheckoutData, fincraWebinarCheckoutData, getProductBySlug, initializeDigitalProductPayment } from "@/api/authentication/auth";
import { Load } from "@/components/loading";
import Checkout from "@/components/checkout";

const DigitalProduct = () => {
  const params = useParams();
  const router = useRouter();
  const { username, productSlug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provider, setProvider] = useState("");
  const [productData, setProductData] = useState(null);
  const [checkout, setCheckout] = useState(false);
  const [loader, setLoader] = useState(false);
  const [submit, setSubmit] = useState(false);
  const { startPayment } = useFincraPayment();
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [main, setMain] = useState(true);
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
          const productType = response.data.data.type; // "booking" or "webinar"
          setProvider(response.data.data?.provider);
          let mappedData;
          console.log(apiData, "apiData");
          setProduct(apiData);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        console.log(err)
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

  const handleAccessProduct = (z) => {
    let productId = product?.id;
    try {
      setLoading("Initiating access ...");
      const data = { productId, ...z };

      initializeDigitalProductPayment(data)
        .then((res) => {
          setLoading(false);
          setCheckout(false);
          setIsSuccess(true);
          setFreeMode(true);
          setMain(true);
    
          // setIsSuccess(true);
          // successModal();
          successPaymentModal();
          makeFree();
        })
        .catch((err) => {
          // console.log(err);
          setLoading(false);
          setMain(true);
    
          toast.error(err.response?.data?.message || "Something went wrong");
          setLoading("Access Product");
        });
    } catch (err) {
      console.log(err)
      // console.error(err);
      setLoading("Access Product");
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
      setLoading(true);
      let reference;

      try {
        const res = await fincraDigitalCheckoutData(data, token);
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
                setLoading(false);
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
        setLoading(false);
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
          setLoading(false);
        },
      });
    } catch (err) {
      console.error(err);
      setLoading(false);
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
    setLoading(true);
    fincraDigitalCheckoutData(data, token)
      .then((res) => {
        setLoading(false);
        const url = res.data.data.redirectUrl;
        window.location.href = url;
      })
      .catch((err) => {
        console.log(err);
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



  if (loader) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <Load />
      </div>
    );
  }

  if (error || !product) {
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
      <Link href="/">
        <div className="bg-[#ffff] pt-[61px] pb-[23px] rounded-md px-[80px]">
          <Image
            src="/prooval-logo.svg"
            width={100.44}
            height={36}
            alt="Prooval logo"
          />
        </div>
      </Link>
      <div className="mx-[169px] mt-[40px]">
        <div className="bg-[#fff] px-[56px] py-[24px] rounded-2xl">
          <div className="flex items-center text-sm leading-[150%] font-medium text-[#292D32] pb-[35px]">
            <button
              className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
              // onClick={onClick}
            >
              <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
            </button>
            <span className="text-2xl font-semibold ml-4">Back</span>
          </div>

          {/* Product Details */}
          <div className="flex gap-[16px] ">
            <div className="border p-2 border-[#EDEDED] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
              <div
                className="h-[479px] w-[458px] rounded-lg bg-cover bg-center"
                style={{ backgroundImage: `url(${product?.thumbnail})` }}
              />
            </div>
            <div className="flex flex-col w-[411px]">
              <h3 className="text-[24px] font-semibold mb-4 truncate">
                {product?.title || "Digital Product"}
              </h3>
              <div className="flex items-center gap-[10px] mb-[12px]">
                <span className="text-xs bg-[#DEA8061A] text-[#DEA806] px-3 py-1 rounded-[32px] font-medium">
                  {product?.category || ""}
                </span>
                <button className="flex items-center gap-[4.87px] bg-[#3333331A] rounded-[38.96px] py-[5.37px] px-[14.61px] sxm:px-3">
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

              <div className="text-sm font-normal tracking-[0.08em] mt-4 text-[#333333] flex flex-col items-start h-[216px]">
                {product?.description || ""}
                {/* <button
                  onClick={() => router.push(``)}
                  className="text-primary underline mt-[16px]"
                >
                  View more
                </button> */}
              </div>
              <div className="flex justify-between items-center border border-[#EAEAEA] bg-[#FAFAFA] p-[16px] rounded-[8px] mt-[99px]">
                <div className="text-[18px] font-bold text-[#333333]">
                  {product?.type === "paid"
                    ? `${product.currency === "NGN" ? "₦" : "$"}${formatPrice(
                        product?.amount
                      )}`
                    : "Free"}
                </div>
                <button
                  className="text-sm text-[#fff] bg-primary px-3 py-[10px] w-[182px] rounded-[6.29px] font-bold truncate"
                  // onClick={handleClick}
                  onClick={openCheckout}
                >
                  {product?.type === "paid" ? "Make Payment" : "Access Now"}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#fff] mt-[10px] px-[56px] pt-[40px] rounded-2xl">
          <div>
            <p>
              fhlsdajflkshfljdhsfajfasdjlfhlasirhiluthrleuiLorem ipsum dolor sit
              amet consectetur. Eget egestas nulla aliquet eget sit risus
              ullamcorper. Fermentum egestas aliquet morbi volutpat. Ultricies
              sapien suspendisse facilisi ultrices porta vestibulum. Condimentum
              amet ridiculus a dolor. Co nvallis tortor venenatis elementum amet
              arcu euismod dis at. At massa etiam morbi donec enim euismod. Nec
              lectus leo montes sit tempor suspendisse odio. Adipiscing a nunc
              ut volutpat sapien pharetra at. In sapien sed facilisis nunc sed
              feugiat eu dignissim. Quam sit velit a massa aliquam viverra. Nec
              tortor in metus faucibus Lorem ipsum dolor sit amet consectetur.
              Eget egestas nulla aliquet eget sit risus ullamcorper. Fermentum
              egestas aliquet morbi volutpat. Ultricies sapien suspendisse
              facilisi ultrices porta vestibulum. Condimentum amet ridiculus a
              dolor.{" "}
            </p>
          </div>
        </div>
      </div>
      {checkout && product && (
        <Checkout
          setLoader={setLoading}
          loader={loader}
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
