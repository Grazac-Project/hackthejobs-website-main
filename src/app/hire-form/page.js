"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import Footer from "@/components/footer/footer";
import { hireTalent } from "@/api/authentication/auth";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/modal/modal";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar/nav";

const initialValues = {
  companyName: "",
  companyLocation: "",
  role: [],
  roleType: "",
  roleMode: "",
  email: "",
  experienceLevel: "",
  roleDescription: "",
};

const Form = () => {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState([]);

  const handleShowCheckbox = () => {
    setShowCheckbox((prev) => !prev);
    // if(values.role.length === 0) {
    //   setSelectedRole([])
    // } else {
    //   setSelectedRole(values.role)
    // }
  };
  const handleCloseCheckbox = () => {
    // console.log(values.role);
    setShowCheckbox(false);
    // if (values.role.length === 0) {
    //   // setSelectedRole([])
    //   setShowCheckbox(false);
    // } else {
    //   // setSelectedRole(values.role)
    //   setShowCheckbox(false);
    // }
    // console.log(values.role);
  };
  const handleRemoveOption = (i) => {
    setShowCheckbox(false);
    const newSelect = values.role.filter((_, index) => {
      if (i !== index) {
        return true;
      }
    });
    values.role = newSelect;
    // console.log(values.role);
    // console.log(newSelect);
    setSelectedRole(newSelect);
  };
  const schema = yup.object({
    companyName: yup.string().required("Please enter the name of your company"),
    companyLocation: yup
      .string()
      .required("Please enter the location of your company"),
    roleType: yup.string().required("Please select an option"),
    role: yup
      .array()
      .min(1, "Please select at least one option")
      .required("Role needed is required"),
    roleMode: yup.string().required("Please select an option"),
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    experienceLevel: yup.string().required("Please select an option"),
    roleDescription: yup.string().required("Please describe the role"),
  });

  const onSubmit = async (values, actions) => {
    setLoader(true);
    // values.role = selectedRole
    // console.log(values);
    // console.log('values',values)
    hireTalent(values)
      .then((res) => {
        setLoader(false);
        if (res.status === 201) {
          setShowModal(true);
          setTimeout(() => {
            router.push("/hire");
          }, 5000);
        }
        // console.log(res);
      })
      .catch((err) => {
        // console.log(err);
        setLoader(false);
      });
    actions.resetForm();
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
    <section className="font-onest">
      <Navbar />

      <div className="px-[80px] xl:px-[25px] xm:px-[16px]">
        {showModal && <Modal modalClose={() => setShowModal(false)} />}

        {/* <Link href='/'><div className='py-[22px]'>
                <Image src="/navLogo.svg" alt="logo" width={164} height={36} />
              </div>
        </Link> */}
        <h1 className="font-medium text-[48px] text-[#101828] leading-[44px] tracking-[-2%] text-center mt-[64px] mb-[20px]">
          Ready to hire? Fill this form
        </h1>
        <p className="font-normal w-[92%] sm:w-[100%]  text-[20px] text-[#667085] text-center leading-[30px] mb-[64px] sm:mb-[24px] mx-auto">
          Your input will help us understand your needs better. Once submitted,
          our team will review your details and reach out if there's a potential
          match for your required positions.
        </p>
        <form
          className="font-inter w-[80%] md:w-[90%] xm:w-[100%] mx-auto"
          onSubmit={handleSubmit}
        >
          <div
            className="flex xm:flex-col justify-between xm:justify-around mb-[24px]"
            onClick={handleCloseCheckbox}
          >
            <div className="flex flex-col w-[48%] xm:w-[100%] gap-[6px] xm:mb-[16px]">
              <label
                className={
                  errors.companyName && touched.companyName
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054]"
                }
              >
                {errors.companyName && touched.companyName
                  ? errors.companyName
                  : "Company name"}
              </label>
              <input
                type="text"
                id="companyName"
                placeholder="Enter name here"
                value={values.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                className="font-normal w-[100%] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput"
              />
            </div>
            <div
              className="flex flex-col w-[48%] xm:w-[100%] gap-[6px]"
              onClick={handleCloseCheckbox}
            >
              <label
                className={
                  errors.companyLocation && touched.companyLocation
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054]"
                }
              >
                {errors.companyLocation && touched.companyLocation
                  ? errors.companyLocation
                  : "Company location"}
              </label>
              <input
                type="text"
                id="companyLocation"
                placeholder="Enter location"
                value={values.companyLocation}
                onChange={handleChange}
                onBlur={handleBlur}
                className="font-normal w-[100%] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput"
              />
            </div>
          </div>
          <div className="relative">
            <div
              className="flex flex-col w-[100%] gap-[6px] mb-[24px]"
              onClick={handleShowCheckbox}
            >
              <label
                className={
                  errors.role && touched.role
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181] mb-[6px]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054] mb-[6px]"
                }
              >
                {errors.role && touched.role ? errors.role : "Role needed"}
              </label>
              <p className="font-normal w-[100%] h-[48px] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput">
                {selectedRole.length > 0 ? "" : "Select Role"}
              </p>
              {showCheckbox ? (
                <IoIosArrowUp className="absolute right-[14px] top-[50px] text-[13.31px] text-[#909090] transform-translate-y-1/2" />
              ) : (
                <IoIosArrowDown className="absolute right-[14px] top-[50px] text-[13.31px] text-[#909090] transform-translate-y-1/2" />
              )}
            </div>
            {showCheckbox && (
              <div className="z-10 w-[410px] sm:w-[90%] p-[24px] rounded-[8px] border-[1px] border-[#EAEAEA] shadow-footerInput bg-[#fff] absolute right-[0] top-[80px]">
                <div className="mb-[24px]">
                  <div className="flex items-center gap-[8px] py-[10px] border-b-[1px] border-b-[#EAEAEA]">
                    <input
                      type="checkbox"
                      id="backend"
                      name="role"
                      value="Backend engineer"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-[20px] h-[20px] text-[#1453FF]"
                    />
                    <label
                      htmlFor="backend"
                      className="font-normal text-[16px] leading-[20px] text-[#334155]"
                    >
                      Back-end Developer
                    </label>
                  </div>
                  <div className="flex items-center gap-[8px] py-[10px] border-b-[1px] border-b-[#EAEAEA]">
                    <input
                      id="frontend"
                      type="checkbox"
                      name="role"
                      value="Frontend engineer"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-[20px] h-[20px] text-[#1453FF]"
                    />
                    <label
                      htmlFor="frontend"
                      className="font-normal text-[16px] leading-[20px] text-[#334155]"
                    >
                      Front-end Developer
                    </label>
                  </div>
                  <div className="flex items-center gap-[8px] py-[10px] border-b-[1px] border-b-[#EAEAEA]">
                    <input
                      id="MobileAppDeveloper"
                      type="checkbox"
                      name="role"
                      value="MobileAppDeveloper"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-[20px] h-[20px] text-[#1453FF]"
                    />
                    <label
                      htmlFor="MobileAppDeveloper"
                      className="font-normal text-[16px] leading-[20px] text-[#334155]"
                    >
                      Mobile App Developer
                    </label>
                  </div>
                  <div className="flex items-center gap-[8px] py-[10px] border-b-[1px] border-b-[#EAEAEA]">
                    <input
                      id="ProductManager"
                      type="checkbox"
                      name="role"
                      value="Product manager"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-[20px] h-[20px] text-[#1453FF]"
                    />
                    <label
                      htmlFor="ProductManager"
                      className="font-normal text-[16px] leading-[20px] text-[#334155]"
                    >
                      Product Manager
                    </label>
                  </div>
                  <div className="flex items-center gap-[8px] py-[10px] border-b-[1px] border-b-[#EAEAEA]">
                    <input
                      id="ProductDesigner"
                      type="checkbox"
                      name="role"
                      value="Product designer"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-[20px] h-[20px] text-[#1453FF]"
                    />
                    <label
                      htmlFor="ProductDesigner"
                      className="font-normal text-[16px] leading-[20px] text-[#334155]"
                    >
                      Product Designer
                    </label>
                  </div>
                </div>
                {/* <button type='submit' onClick={handleCloseCheckbox} className='w-[142px] border-[1px] border-[#1453FF] bg-[#1453FF] text-[#fff] px-[20px] py-[12px] rounded-[8px]'>
                  Save
                </button> */}
              </div>
            )}
            <div className="flex flex-wrap gap-[5px] mb-[24px]">
              {values.role.map((ele, i) => (
                <div
                  key={i}
                  className="flex items-center w-[24%] lgx:w-[32%] sm:w-[49%] mb-[5px] border-[1px] border-[#D0D5DD] rounded-[8px] shadow-footerInput px-[16px] md:px-[10px] py-[5px] xm:py-[4px]"
                >
                  {/* <p className='font-inter font-normal w-[216.25px] rounded-[8px] text-[16px] text-[#667085] leading-[24px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput'>{ele}</p> */}
                  <p className="font-inter font-normal w-[100%]  text-[16px] sm:text-[14px] ssxm:text-[10px] text-[#667085] leading-[24px]">
                    {ele}
                  </p>
                  <span
                    className=" text-[24px] sm:text-[20px] text-[#909090] cursor-pointer"
                    onClick={() => handleRemoveOption(i)}
                  >
                    &times;
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div
            className="flex xm:flex-col justify-between xm:justify-around mb-[24px]"
            onClick={handleCloseCheckbox}
          >
            <div className="flex flex-col w-[48%] xm:w-[100%] gap-[6px] xm:mb-[16px]">
              <label
                className={
                  errors.roleMode && touched.roleMode
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054]"
                }
              >
                {errors.roleMode && touched.roleMode
                  ? errors.roleMode
                  : "Role Mode"}
              </label>
              <select
                id="roleMode"
                onChange={handleChange}
                onBlur={handleBlur}
                className="font-normal w-[100%] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput"
              >
                <option value="">Select Role Mode</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
                <option value="onSite">Onsite</option>
              </select>
            </div>
            <div
              className="flex flex-col w-[48%] xm:w-[100%] gap-[6px] "
              onClick={handleCloseCheckbox}
            >
              <label
                className={
                  errors.roleType && touched.roleType
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054]"
                }
              >
                {errors.roleType && touched.roleType
                  ? errors.roleType
                  : "Role Type"}
              </label>
              <select
                id="roleType"
                onChange={handleChange}
                onBlur={handleBlur}
                className="font-normal w-[100%] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput"
              >
                <option value="">Select Role Type</option>
                <option value="contract">Contract</option>
                <option value="partTime">Part-Time</option>
                <option value="fullTime">Full-Time</option>
              </select>
            </div>
          </div>
          <div
            className="flex xm:flex-col justify-between xm:justify-around mb-[24px]"
            onClick={handleCloseCheckbox}
          >
            <div className="flex flex-col w-[48%] xm:w-[100%] gap-[6px] xm:mb-[16px]">
              <label
                className={
                  errors.email && touched.email
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054]"
                }
              >
                {errors.email && touched.email ? errors.email : "Email"}
              </label>
              <input
                type="text"
                id="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="you@company.com"
                className="font-normal w-[100%] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput"
              />
            </div>
            <div className="flex flex-col w-[48%] xm:w-[100%] gap-[6px] ">
              <label
                className={
                  errors.experienceLevel && touched.experienceLevel
                    ? "font-medium text-[14px] leading-[20px] text-[#fc8181]"
                    : "font-medium text-[14px] leading-[20px] text-[#344054]"
                }
              >
                {errors.experienceLevel && touched.experienceLevel
                  ? errors.experienceLevel
                  : "Experience Level"}
              </label>
              <select
                id="experienceLevel"
                onChange={handleChange}
                onBlur={handleBlur}
                className="font-normal w-[100%] text-[16px] leading-[24px] text-[#667085] rounded-[8px] px-[16px] py-[12px] border-[1px] border-[#D0D5DD] shadow-footerInput"
              >
                <option value="">Select Experience Level</option>
                <option value="senior">Senior</option>
                <option value="mid">Mid-Level</option>
                <option value="junior">Junior</option>
              </select>
            </div>
          </div>
          <div
            className="flex flex-col w-[100%] gap-[6px] mb-[32px]"
            onClick={handleCloseCheckbox}
          >
            <label
              className={
                errors.roleDescription && touched.roleDescription
                  ? "font-medium text-[14px] leading-[20px] text-[#fc8181] mb-[6px]"
                  : "font-medium text-[14px] leading-[20px] text-[#344054] mb-[6px]"
              }
            >
              {errors.roleDescription && touched.roleDescription
                ? errors.roleDescription
                : "Role Description"}
            </label>
            <textarea
              id="roleDescription"
              value={values.roleDescription}
              onChange={handleChange}
              onBlur={handleBlur}
              rows="5"
              cols="7"
              placeholder="Enter other requirements"
              className="font-normal w-[100%] text-[16px] leading-[24px] border-[1px] border-[#D0D5DD] py-[10px] px-[14px] rounded-[8px]"
            ></textarea>
          </div>
          <button
            type="submit"
            className="font-inter font-medium text-[16px] block leading-[24px] text-[#fff] w-[343px] xm:w-[100%] rounded-[8px] px-[20px] py-[12px] bg-[#1453FF] border-[1px] border-[#1453FF] shadow-footerInput mx-auto"
          >
            {loader ? (
              <Image
                src="/loader.gif"
                width={16}
                height={16}
                alt="loader"
                className="mx-auto"
              />
            ) : (
              "Hire Now"
            )}
          </button>
        </form>
      </div>
      <Footer openModal={() => setShowModal(true)} />
    </section>
  );
};

export default Form;
