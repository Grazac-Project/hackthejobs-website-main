"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";
import { IoIosArrowRoundBack } from "react-icons/io";
import { allProductCheckout } from "@/api/authentication/auth";
import { getCurrencySymbol } from "@/Utils/currency-formatter";


const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
};

const Checkout = ({loader, setLoader, goBack, checkoutCallback, productId, productDescription, productPrice, productCurrency, productType, category}) => {
  const router = useRouter();
  // const [loader, setLoader] = useState(false);

  const schema = yup.object({
    firstName: yup.string().required("Firstname is required"),
    lastName: yup.string().required("Lastname is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
  });

  const onSubmit = async (values, actions) => {
    setLoader(true);
    const newValues = {
      ...values,
      productId: productId,
      currency: productCurrency
    }
    checkoutCallback(newValues)
  };

  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit,
  });
  return (
    <div className="min-h-[100vh] py-[80px] xm:py-0 flex justify-center items-center font-satoshi bg-[url(/auth-bg.png)] bg-cover xm:bg-[#fff]">
      <div className="w-[538px] max-w-full xm:min-h-[100vh] bg-[#fff] p-8 sm:p-[16px] rounded-[8px]">
        <div className="mb-8 xm:mb-[40px]">
          <Image
            src="/prooval-logo.svg"
            width={101}
            height={36}
            alt="prooval logo"
          />
        </div>
        <div className=" flex gap-[16px] items-center mb-8 xm:mb-5">
          <div
            className="border-[1px] border-[#EAEAEA] rounded-[8px] p-[10px] cursor-pointer"
              onClick={goBack}
          >
            <IoIosArrowRoundBack className="text-[16px] text-[#292D32]" />
          </div>
          <p className="font-bold text-[20px] sm:text-[16px] leading-[28px] sm:leading-[24px] tracking-[0%] text-[#121927]">
            Back
          </p>
        </div>
        <div className="w-full border border-[#E2E8F0] rounded-[8px] px-6 py-4 bg-[#FAFAFA] mb-8 xm:mb-5">
          <div className="flex justify-between mb-8">
            <div>
              <h2 className="font-normal text-[14px] text-[#101828] leading-[180%] tracking-[0] mb-2">
                Product type
              </h2>
              <p className="font-bold text-[16px] text-[#292D32] leading-[22px]">
                {category}
              </p>
            </div>
            <div>
              <h2 className="font-normal text-[14px] text-[#101828] leading-[180%] tracking-[0] mb-2">
                Price
              </h2>
              {String(productPrice) !== '0'?<p className="font-bold text-[16px] text-[#292D32] leading-[22px]">
                {getCurrencySymbol(productCurrency)}{String(productPrice)}
              </p>: <p className="font-bold text-[16px] text-[#292D32] leading-[22px]">Free</p>}
            </div>
          </div>
          <div>
            <h2 className="font-normal text-[14px] text-[#101828] leading-[180%] tracking-[0] mb-2">
             {category?.toLowerCase() === "webinar" ? "Webinar title" : "Product name"}
            </h2>
            <p className="font-bold text-[16px] text-[#292D32] leading-[22px]">
              {productDescription}
            </p>
          </div>
        </div>
        <form className="text-[#333] font-normal" onSubmit={handleSubmit}>
          <div className="mb-8 xm:mb-5">
            <div className="">
              <label
                htmlFor="firstName"
                className={`text-[16px] leading-[140%] tracking-[0] mb-2 block ${
                  errors.firstName && touched.firstName
                    ? "text-[#fc8181]"
                    : "text-[#333333] "
                }`}
              >
                {errors.firstName && touched.firstName
                  ? `${errors.firstName}`
                  : "First Name"}
              </label>
            </div>
            <input
              type="text"
              id="firstName"
              placeholder="Enter first name"
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="font-normal text-[14px] leading-[120%] tracking-[0] block text-[#828282] border-[1px] border-[#EAEAEA] h-[48px] w-[100%] rounded-[8px] p-[15px] outline-none"
            />
          </div>
          <div className="mb-8 xm:mb-5">
            <div className="">
              <label
                htmlFor="lastName"
                className={`text-[16px] leading-[140%] tracking-[0] mb-2 block ${
                  errors.lastName && touched.lastName
                    ? "text-[#fc8181]"
                    : "text-[#333333] "
                }`}
              >
                {errors.lastName && touched.lastName
                  ? `${errors.lastName}`
                  : "Last Name"}
              </label>
            </div>
            <input
              type="text"
              id="lastName"
              placeholder="Enter name"
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="font-normal text-[14px] leading-[120%] tracking-[0] block text-[#828282] border-[1px] border-[#EAEAEA] h-[48px] w-[100%] rounded-[8px] p-[15px] outline-none"
            />
          </div>
          <div className="mb-8 xm:mb-5">
            <div className="">
              <label
                htmlFor="email"
                className={`text-[16px] leading-[140%] tracking-[0] mb-2 block ${
                  errors.email && touched.email
                    ? "text-[#fc8181]"
                    : "text-[#333333] "
                }`}
              >
                {errors.email && touched.email ? `${errors.email}` : "Email"}
              </label>
            </div>
            <input
              type="text"
              id="email"
              placeholder="Enter email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="font-normal text-[14px] leading-[120%] tracking-[0] block text-[#828282] border-[1px] border-[#EAEAEA] h-[48px] w-[100%] rounded-[8px] p-[15px] outline-none"
            />
          </div>
          <button className="flex justify-center items-center w-[100%] bg-[#1453FF] border-[0.3px] border-[#654DE4] rounded-[4px] h-[48px] text-[#fff] mb-[24px]">
            {loader ? (
              <Image
                src="/loader.gif"
                width={16}
                height={16}
                unoptimized={true}
                alt="loader"
              />
            ) : (
              "Checkout"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
