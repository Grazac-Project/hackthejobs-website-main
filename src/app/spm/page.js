"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { MdVerified } from "react-icons/md";
import {
  cardValues,
  imageCards,
  spmCardValues,
  testimonials,
} from "@/constants/constant";
import Slider from "react-slick";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/nav";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "@/components/modal/modal";
import { fetchMentors } from "@/api/authentication/auth";
import ValueCard from "@/components/valueCard/spmValueCard copy";
import { LuDot } from "react-icons/lu";

const spm = () => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [angle, setAngle] = useState("2.93deg");
  const [color, setColor] = useState("#F2C003");
  const [border, setBorder] = useState("#FFEFB2");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dotPosition, setDotPosition] = useState(1);
  const [load, setLoad] = useState(false);
  const [logo, setLogo] = useState(false);
  const [logo1, setLogo1] = useState(false);
  const [logo2, setLogo2] = useState(false);
  const [logo3, setLogo3] = useState(false);
  const [logo4, setLogo4] = useState(false);
  const [listOfMentors, setListOfMentors] = useState([]);

  const sliderDotChange = setInterval((index) => {
    if (index === 0) {
      setDotPosition(index);
    }
    if (index === 1) {
      setDotPosition(index);
    }
    if (index === 2) {
      setDotPosition(index);
    }
  }, 0);

  let sliderRef = useRef(null);

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: false,
    dotsClass: "slick-dots custom-dots",
    // beforeChange: (current, next) => {console.log(current);
    //   console.log(next);
    //   setCurrentSlide(next)},,

    afterChange: (index) => {
      setDotPosition(index);
    },
  };
  const logoSettings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: false,
    dotsClass: "slick-dots custom-dots",
    beforeChange: (current, next) => setCurrentSlide(next),

    afterChange: (index) => setCurrentSlide(index),
  };
  const mentorSettings = {
    dots: false,
    infinite: true,
    speed: 900,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
    centerMode: true,
    centerPadding: "15px",
    arrows: false,
    nextArrow: false,
    prevArrow: false,
    dotsClass: "slick-dots custom-dots",
    beforeChange: (current, next) => setCurrentSlide(next),

    afterChange: (index) => setCurrentSlide(index),
  };
  const handleContact = () => {
    router.push("/faq#contact-form");
  };
  const goToSlide = (index, i) => {
    if (index === i) {
      sliderRef.slickGoTo(i);
      // setCurrentSlide(i);
      setDotPosition(i);
    }
    sliderRef.slickGoTo(i);
    // setCurrentSlide(i);
    setDotPosition(i);
  };

  const handleMouseOver = () => {
    setLoad(true);
  };

  const handleLogoEvent = () => {
    setLogo((prev) => !prev);
  };
  const handleLogoEvent1 = () => {
    setLogo1((prev) => !prev);
  };
  const handleLogoEvent2 = () => {
    setLogo2((prev) => !prev);
  };
  const handleLogoEvent3 = () => {
    setLogo3((prev) => !prev);
  };
  const handleLogoEvent4 = () => {
    setLogo4((prev) => !prev);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-[1440px] mx-auto">
        <section className="font-onest px-[80px] mx-aut xl:px-[25px] sm:px-[25px] xm:px-[16px] relative bg-[#F9FBFF]">
          <div className="  py-[48px] flex sm:flex-col gap-[58px] xl:gap-[25px] items-center ">
            <div className="">
              {/* <div className='flex gap-2 w-[256px] md:w-[200px] sm:w-[256px] py-2 px-3 rounded-[32px] justify-center items-center border-[0.6px] border-[#989898] mb-[32px] whitespace-pre'> */}
              <div className="font-inter flex gap-2 w-fit   px-3 py-2 rounded-[32px] justify-center items-center border-[0.6px] border-[#989898] mb-[32px] whitespace-pre">
                <MdVerified className="text-[#FFD700] text-[16px]" />
                <h3 className="font-medium text-[14px] text-[#121927] leading-[15.4px] tracking-[4%] ">
                  Senior Product Manager
                </h3>
              </div>
              <h1 className="font-bold w-[621px] xxl:w-[550px] xl:w-[500px] lg:w-[400px] md:w-[300px] sm:w-[100%] text-[64px] xxl:text-[50px] xl:text-[45px] lg:text-[35px] md:text-[25px] sm:text-[52px] xm:text-[45px] xxm:text-[40px] leading-[83.2px] xxl:leading-[75px] md:leading-[44px] sm:leading-[54px]  text-[#121927] ">
                Manage the next Top-Talents
              </h1>
              <p className="font-normal text-[18px] lg:text-[16px] leading-6 text-[#727272] w-[555px] xl:w-[500px] lg:w-[400px] md:w-[300px] sm:w-[100%] pt-8 sm:pt-4 pb-8">
                Lead and shape the next generation of tech talent for the
                future. Showcase your in-depth knowledge by scaling a team of
                entry-level tech fellows.
              </p>
              {/* <Link href="https://hackthejobs-web-dashoard-production.up.railway.app/auth/signup"> */}
              {/* <Link href="#">
                <button className="font-medium leading-6 tracking-[3%] text-4 text-[#fff] bg-primary rounded-[8px] px-10 lg:px-4 md:px-3 py-4 mr-[16px] lg:mr-[12px] sm:mr-[5px]">
                  Become a SPM
                </button>
              </Link> */}
              <a
                href="https://spm.hackthejobs.com/auth/signup"
                target="_blank"
                className="font-medium leading-6 tracking-[3%] text-4 text-[#fff] bg-primary rounded-[8px] px-10 lg:px-4 md:px-3 py-4 mr-[16px] lg:mr-[12px] sm:mr-[5px]"
              >
                Join as a Senior PM
              </a>
            </div>
            <div className="w-[598px] sm:w-[100%] pl-[40px] xxl:pl-[30px] pr-[37px] xxl:pr-[30px]">
              <Image
                // src="/spm-hero.png"
                src="/fred-hero.png"
                alt="group of pictures"
                width={524}
                height={673}
                className="object-cover"
                onMouseOver={handleMouseOver}
              />
            </div>
          </div>
          <div
            className={`z-[1] absolute  flex items-center gap-2  px-[24px] lgx:px-[10px] py-[12px] lgx:py-2 rounded-[4px] border-[0.6px] bg-[#fff] border-[#E4E7EC] shadow-def transition-all duration-1000 ease-in-out ${
              load
                ? "top-[120px] xxl:top-[120px] sm:top-[540px] xxm:top-[560px] sxm:top-[650px] right-[463px] xxl:right-[400px] xl:right-[390px] lgx:right-[350px] lg:right-[330px] md:right-[250px] sm:right-[350px] xm:right-[240px] xxm:right-[220px] sxm:right-[150px]"
                : "top-[81px] 1xl:top-[60px] xxl:top-[70px] sm:top-[510px] xm:top-[560px] xxm:top-[570px] xxxm:top-[520px] xxxxm:top-[570px] sxm:top-[630px] right-[623px] 1xl:right-[520px] xxl:right-[520px] xl:right-[480px] lgx:right-[400px] lg:right-[400px] md:right-[300px] sm:right-[410px] xm:right-[290px] xxm:right-[230px] xxxm:right-[280px] xxxxm:right-[250px] sxm:right-[200px]"
            }`}
          >
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain sm:hidden"
            />
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain hidden sm:block"
            />
            <p className="font-normal text-[12px] text-[#414449]  sm:text-[6.87px] leading-[13px] sm:leading-[7.44px] gap-2 mx-auto text-center text-[#121927]">
              Product Designer
            </p>
          </div>
          <div
            className={` absolute bg-[#fff] w-[205px] lgx:w-[189px] items-center sm:w-[117.32px] px-[18px] lgx:px-[10px] py-[12px] lgx:py-2  shadow-ghi border-[#E4E7EC] border-[0.9px] flex justify-center gap-[8px] lg:gap-[8px] sm:gap-[2.29px] sm:items-center transition-all duration-1000 ease-in-out ${
              load
                ? "top-[189px] lgx:top-[160px] sm:top-[580px] sxm:top-[665px] right-[62.5px] lgx:right-[40px] sm:right-[70px] xm:right-[60px]"
                : "top-[149px] lgx:top-[120px] sm:top-[530px] xm:top-[600px] sxm:top-[625px] right-[22.5px] lgx:right-[0px] sm:right-[30px] xm:right-[10px]  "
            }`}
          >
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain sm:hidden"
            />
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain hidden sm:block"
            />
            <p className="font-normal text-[14px] sm:text-[8px] text-[#414449] leading-[24px] lgx:leading-4 sm:leading-[11.54px]">
              Product Manager
            </p>
          </div>
          <div
            className={` absolute bg-[#fff] flex justify-center items-center sm:w-[117.32px] px-[18px] lgx:px-[10px] py-[12px] lgx:py-2 gap-2 rounded-sm  shadow-def transition-all duration-1000 ease-in-out ${
              load
                ? "bottom-[232px] xxl:bottom-[200px] lgx:bottom-[140px] md:bottom-[170px] sm:bottom-[310px] xm:bottom-[210px] sxm:bottom-[150px] right-[513px] xxl:right-[450px] xl:right-[470px] lgx:right-[370px] lg:right-[340px] md:right-[290px] sm:right-[440px] xm:right-[290px] xxm:right-[260px] xxxm:right-[270px] xxxxm:right-[260px] ssxm:right-[240px] sxm:right-[200px]"
                : "bottom-[182px] xxl:bottom-[140px] lgx:bottom-[110px] md:bottom-[130px] sm:bottom-[280px] xm:bottom-[180px] sxm:bottom-[120px] right-[613px] 1xl:right-[540px] xxl:right-[520px] xl:right-[500px] lgx:right-[400px] lg:right-[390px] md:right-[320px] sm:right-[470px] xm:right-[320px] xxm:right-[280px] xxxm:right-[300px] xxxxm:right-[280px] ssxm:right-[260px] sxm:right-[220px]"
            }`}
          >
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain sm:hidden"
            />
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain hidden sm:block"
            />
            <p className="font-normal  text-[14px] sm:text-[8px] text-[#414449] leading-[20.85px] lgx:leading-4 sm:leading-[11.93px]">
              Back-End Developer
            </p>
          </div>
          <div
            className={` absolute bg-[#fff]  flex  items-center justify-center gap-[8px] rounded-[4px] border-[0.9px] border-[#E4E7EC] px-6  py-[12px] lgx:py-2 shadow-ghi transition-all duration-1000 ease-in-out ${
              load
                ? "bottom-[200px] xxl:bottom-[160px] sm:bottom-[180px] xm:bottom-[140px] right-[100px] xxl:right-[50px] sm:right-[60px] xm:right-[40px]"
                : "bottom-[134px] sm:bottom-[140px] xm:bottom-[100px] right-[0px] sm:right-[40px] xm:right-[10px]"
            }`}
          >
            {" "}
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain sm:hidden"
            />
            <Image
              src="product.svg"
              alt="students"
              width={32}
              height={32}
              className="mx-auto object-contain hidden sm:block"
            />
            <p className="font-normal  text-[14px] sm:text-[8px] text-[#414449] leading-[20.85px] lgx:leading-4 sm:leading-[11.93px]">
              Front-End Developer
            </p>
          </div>
          <Image
            src="/tiny-star.png"
            width={25}
            height={24}
            alt="tiny star"
            className="absolute top-[112.38px] 1xl:top-[70px] lgx:top-[25px] sm:top-[20px] left-[110.88px] xxl:left-[100px] lgx:left-[60px] sm:left-[37px]"
          />
          <Image
            src="/hero-star.png"
            width={59}
            height={59}
            alt="big star"
            className="absolute top-[112.38px] 1xl:top-[70px]  sm:top-[10px] right-[753px] 1xl:right-[650px] xxl:right-[620px] lgx:right-[520px] lg:right-[500px] md:right-[400px] sm:right-[20px] z-[0]"
          />

          {/* right-[623px] 1xl:right-[520px] xxl:right-[520px] xl:right-[480px] lgx:right-[400px] lg:right-[400px] md:right-[300px] sm:right-[410px] xm:right-[290px] xxm:right-[230px] sxm:right-[200px] */}
        </section>
        <section className="font-onest px-[80px] xl:px-[25px] xm:px-[16px] py-[48px] sm:py-[32px] bg-[#F9F9F9]">
          <h2 className="font-medium text-[24px] leading-[38px] text-[#121927] text-center mb-[32px]">
            As featured in
          </h2>
          <div className="sm:hidden flex justify-between items-center">
            <div
              className=""
              onMouseOver={handleLogoEvent}
              onMouseOut={handleLogoEvent}
            >
              {logo ? (
                <Image
                  src="/techcabal.png"
                  alt="group of pictures"
                  width={164}
                  height={39}
                />
              ) : (
                <Image
                  src="/techcabal-initial.png"
                  alt="group of pictures"
                  width={164}
                  height={39}
                />
              )}
            </div>
            <div
              className=""
              onMouseOver={handleLogoEvent1}
              onMouseOut={handleLogoEvent1}
            >
              {logo1 ? (
                <Image
                  src="/bendada.png"
                  alt="group of pictures"
                  width={179}
                  height={29}
                />
              ) : (
                <Image
                  src="/bendada-initial.png"
                  alt="group of pictures"
                  width={179}
                  height={29}
                />
              )}
            </div>
            <div
              className=""
              onMouseOver={handleLogoEvent2}
              onMouseOut={handleLogoEvent2}
            >
              {logo2 ? (
                <Image
                  src="/techcrunch.png"
                  alt="group of pictures"
                  width={74}
                  height={37}
                />
              ) : (
                <Image
                  src="/techcrunch-initial.png"
                  alt="group of pictures"
                  width={74}
                  height={37}
                />
              )}
            </div>
            <div
              className=""
              onMouseOver={handleLogoEvent3}
              onMouseOut={handleLogoEvent3}
            >
              {logo3 ? (
                <Image
                  src="/bi.png"
                  alt="group of pictures"
                  width={165}
                  height={15}
                />
              ) : (
                <Image
                  src="/bi-initial.png"
                  alt="group of pictures"
                  width={165}
                  height={15}
                />
              )}
            </div>
            <div
              className=""
              onMouseOver={handleLogoEvent4}
              onMouseOut={handleLogoEvent4}
            >
              {logo4 ? (
                <Image
                  src="/techpoint.png"
                  alt="group of pictures"
                  width={164}
                  height={50}
                />
              ) : (
                <Image
                  src="/techpoint-initial.png"
                  alt="group of pictures"
                  width={164}
                  height={50}
                />
              )}
            </div>
          </div>
          <div className="hidden sm:block sm:pb-[0px] sm:w-[100%] xm:w-[100%] mx-auto px-[80px] lgx:px-[25px] sm:px-[16px]">
            <Slider
              ref={(slider) => {
                sliderRef = slider;
              }}
              {...logoSettings}
              className=""
            >
              <div
                className="pr-[30px]"
                onMouseOver={handleLogoEvent}
                onMouseOut={handleLogoEvent}
              >
                {logo ? (
                  <Image
                    src="/techcabal-mobile.png"
                    alt="group of pictures"
                    width={146}
                    height={34}
                  />
                ) : (
                  <Image
                    src="/techcabal-mobile-initial.png"
                    alt="group of pictures"
                    width={146}
                    height={34}
                  />
                )}
              </div>
              <div
                className="pr-[30px]"
                onMouseOver={handleLogoEvent1}
                onMouseOut={handleLogoEvent1}
              >
                {logo1 ? (
                  <Image
                    src="/bendada-mobile.png"
                    alt="group of pictures"
                    width={160}
                    height={26}
                  />
                ) : (
                  <Image
                    src="/bendada-mobile-initial.png"
                    alt="group of pictures"
                    width={160}
                    height={26}
                  />
                )}
              </div>
              <div
                className=""
                onMouseOver={handleLogoEvent2}
                onMouseOut={handleLogoEvent2}
              >
                {logo2 ? (
                  <Image
                    src="/techcrunch-mobile.png"
                    alt="group of pictures"
                    width={66}
                    height={36}
                  />
                ) : (
                  <Image
                    src="/techcrunch-mobile-initial.png"
                    alt="group of pictures"
                    width={66}
                    height={36}
                  />
                )}
              </div>
              <div
                className="pr-[30px]"
                onMouseOver={handleLogoEvent3}
                onMouseOut={handleLogoEvent3}
              >
                {logo3 ? (
                  <Image
                    src="/bi-mobile.png"
                    alt="group of pictures"
                    width={147}
                    height={14}
                  />
                ) : (
                  <Image
                    src="/bi-mobile-initial.png"
                    alt="group of pictures"
                    width={147}
                    height={14}
                  />
                )}
              </div>
              <div
                className="pr-[30px]"
                onMouseOver={handleLogoEvent4}
                onMouseOut={handleLogoEvent4}
              >
                {logo4 ? (
                  <Image
                    src="/techpoint-mobile.png"
                    alt="group of pictures"
                    width={146}
                    height={44}
                  />
                ) : (
                  <Image
                    src="/techpoint-mobile-initial.png"
                    alt="group of pictures"
                    width={146}
                    height={45}
                  />
                )}
              </div>
            </Slider>
          </div>
        </section>
        <section className="h-[64px] bg-[#fff]"></section>
        <section className="px-[80px] xl:px-[25px] xm:px-4 py-[137.5px] sm:py-[62px] font-onest bg-[#121927] relative">
          <h2 className="font-medium text-[48px] lg:text-[32px] leading-[52.8px] lg:leading-[41.6px] text-[#FFFFFF] text-center w-[865px] lg:w-[95%] mx-auto pb-3">
            Why become a Senior PM
          </h2>
          <h3 className="font-normal text-[18px] text-[#FCFCFC] lg:text-[16px] leading-6 lg:leading-[20.8px] text-center text-[#333] w-[690px] md:w-[100%] mx-auto pb-[42px]">
            Hackthejobs offers you a unique opportunity to make an impact on the
            future of tech in Africa.
          </h3>

          <ValueCard />
          <Image
            src="/big-star1.png"
            width={127}
            height={128}
            alt="star"
            className="absolute top-[0] right-[154px] lgx:hidden block"
          />
          <Image
            src="/mobile-bigstar.png"
            width={74}
            height={65}
            alt="star"
            className="absolute top-[0] right-[16px] lgx:block hidden"
          />
        </section>
        <section className="w-[100%] font-onest flex sm:flex-wrap justify-center sm:justify-around gap-[24px] lg:gap-[16px] px-[112px] xxl:px-[80px] xl:px-[25px] xm:px-[16px] py-[64px] sm:py-[52px]">
          <div className="w-[28.125%] xxl:w-[30%] lgx:w-[33%] lg:w-[35%] md:w-[38%] sm:w-[100%] bg-[#1453FF] rounded-[16px] pt-[70px] pl-[30px] xl:pl-[15px] pr-[14px] pb-[72px] xxl:pb-[22px] relative">
            <h4 className="w-[245px] xl:w-[275px] lg:w-[250px] md:w-[220px] sm:w-[70%] xm:w-[231px] font-medium text-[48px] xl:text-[45px] lg:text-[40px] md:text-[40px] sm:text-[48px] xm:text-[32px] leading-[52.8px] xm:leading-[35.2px] text-[#FBFCFD] pb-[17px]">
              Join as a Senior PM in four easy steps
            </h4>
            <Image
              src="/easy-arrow.png"
              width={123}
              height={117}
              alt="arrow"
              className="absolute top-[9.32px] right-[14.18px] object-cover sm:hidden"
            />
            <Image
              src="/easy-arrow-mobile.png"
              width={126}
              height={123}
              alt="arrow"
              className="absolute top-[59.6px] right-[0px] ssxm:right-[-15px] object-cover hidden sm:block"
            />
          </div>
          <div className="w-[69.90%] xxl:w-[70%] lgx:w-[67%] lg:w-[65%] md:w-[62%] sm:w-[100%] flex flex-wrap sm:justify-around gap-[16px] lgx:gap-[12px] lg:gap-[10px]">
            {spmCardValues.map((cardValue, i) => {
              return (
                <div
                  className="font-onest w-[48%] sm:w-[100%] border-[1px] border-[#EAEAEA] rounded-[8px] px-5 md:px-2 sm:px-5 py-4"
                  key={i}
                >
                  <h4 className="border-[2px] border-[#D0DDFF] w-[44px] h-[44px] rounded-[50%] flex items-center justify-center text-[18px] leading-[20.31px] font-medium text-[#fff] bg-[#1453FF]">
                    {cardValue.number}
                  </h4>
                  <h5 className="pt-[25px] pb-[14px] font-medium text-[20px] leading-[30px] text-[#121927]">
                    {cardValue.heading}
                  </h5>
                  <p className="font-normal text-[14px] leading-[20px] text-[#4F4F4F]">
                    {cardValue.text}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
        <section className=" p-20 md:p-5 ">
          <div className="flex items-center justify-center gap-[109px] xxl:gap-[50px] lg:flex-col-reverse">
            <div className=" w-[539px] font-onest xxl:w-auto ">
              <h4 className="font-medium text-[48px] md:text-[40px] sm:text-[32px] leading-[52.8px] md:leading-[40px] sm:leading-[35.2px] text-[#101828] mx-auto mb-6 sm:text-center">
                What we expect from you as a senior product manager.
              </h4>
              <ul className="custom-list list-disc list-outside pl-6">
                {/* <div className="flex gap-[2px] "> */}
                {/* <i>
                  <LuDot className="text-[40px] font-onest leading-[24px] text-[#4F4F4F]" />
                </i> */}
                <li className="text-[16px] font-500  font-onest leading-[25.75px] text-[#4F4F4F]">
                  Supervise a team of 5 fellows to build an SDG focused project.
                </li>
                {/* </div> */}
                {/* <div className="flex gap-[2px] "> */}
                {/* <i>
                  <LuDot className="text-[40px] font-onest leading-[24px] text-[#4F4F4F]" />
                </i> */}
                <li className="text-[16px] font-500  font-onest leading-[25.75px] text-[#4F4F4F]">
                  Manage end-to-end of the project development lifecycle.
                </li>
                {/* </div> */}
                {/* <div className="flex gap-[2px] "> */}
                {/* <i>
                  <LuDot className="text-[40px] font-onest leading-[24px] text-[#4F4F4F]" />
                </i> */}
                <li className="text-[16px] font-500  font-onest leading-[25.75px] text-[#4F4F4F]">
                  Introduce the team to a project management tools e.g Jira,
                  Clickup, Trello, etc.
                </li>
                {/* </div> */}
                {/* <div className="flex gap-[2px] mb-6 "> */}
                {/* <i>
                  <LuDot className="text-[40px] font-onest leading-[24px] text-[#4F4F4F]" />
                </i> */}
                <li className="text-[16px] font-500  font-onest leading-[25.75px] text-[#4F4F4F] mb-6">
                  Serve as a voice for the fellows, ensuring that their needs
                  and challenges are well communicated.
                </li>
                {/* </div> */}
              </ul>
              {/* <p className="font-normal text-[16px] leading-[24px] sm:leading-[19.2px] text-center text-[#FAFAFA] py-2 sm:py-4">
                Together, let's build a brighter future for the tech workforce.
              </p> */}
              {/* <button className="font-medium leading-6 tracking-[3%] text-4 text-[#fff] bg-primary rounded-[8px] px-10 lg:px-4 md:px-3 py-4 mr-[16px] lg:mr-[12px] sm:mr-[5px]">
                Become a SPM
              </button> */}
              <a
                href="https://spm.hackthejobs.com/auth/signup"
                target="_blank"
                className="font-medium leading-6 tracking-[3%] text-4 text-[#fff] bg-primary rounded-[8px] px-10 lg:px-4 md:px-3 py-4 mr-[16px] lg:mr-[12px] sm:mr-[5px]"
              >
                Join as a Senior PM
              </a>
            </div>
            {/* <Image src="/donateImg2.png" width={630} height={489} alt="img" /> */}
            <Image src="/mentor-key.png" width={630} height={489} alt="img" />
          </div>
        </section>
        <section className="px-[80px] xl:px-[25px] xm:px-[16px] pt-[80px] sm:mt-[40px]">
          <div className="font-onest bg-[#121927] pt-[122px] pb-[99px] rounded-[16px] bg-[url(/stroke.svg)]">
            <div className="w-[710px] md:w-[100%] mx-auto px-[20px]">
              <h4 className="font-medium text-[48px] md:text-[40px] sm:text-[32px] leading-[52.8px] md:leading-[40px] sm:leading-[35.2px] text-[#fff] mx-auto text-center">
                Have a Question?
              </h4>
              <p className="font-normal text-[16px] leading-[24px] sm:leading-[19.2px] text-center text-[#FAFAFA] py-2 sm:py-4">
                Do you have any enquiries or feedback for the team?
              </p>
              <button
                className="w-[173px] h-[56px] rounded-[8px] bg-[#1453FF] text-[16px] leading-[24px] tracking-[3%] font-medium text-[#fff] block mx-[auto]"
                onClick={handleContact}
              >
                Contact Us
              </button>
            </div>
          </div>
        </section>
      </div>
      <Footer openModal={() => setShowModal(true)} />
    </div>
  );
};

export default spm;
