"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import {
  hireTestimonials,
  hirePitch,
  hireSteps,
  hireSkills,
} from "@/constants/constant";
import Slider from "react-slick";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer/footer";
import Navbar from "@/components/navbar/nav";
import { PopupButton } from "react-calendly";

const Hire = () => {
  const router = useRouter();
  let sliderRef = useRef(null);

  const [changeStyle, setChangeStyle] = useState(null);
  const [styleChange, setStyleChange] = useState(null);
  const [dotPosition, setDotPosition] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [rootElement, setRootElement] = useState(null);

  const handleMouseOver = (i) => {
    setChangeStyle(i);
  };
  const handleMouseOut = (i) => {
    setChangeStyle(null);
  };
  const handleSkillMouseOver = (i) => {
    setStyleChange(i);
  };
  const handleSkillMouseOut = (i) => {
    setStyleChange(null);
  };
  const handleContact = () => {
    router.push("/faq#contact-form");
  };
  const handleHire = () => {
    router.push("/hire-form");
  };

  useEffect(() => {
    setRootElement(document.getElementById("root"));
  }, []);

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
    //   setCurrentSlide(next)},

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
    // beforeChange: (current, next) => setCurrentSlide(next),

    // afterChange: (index) => setCurrentSlide(index),
  };
  const goToSlide = (index, i) => {
    if (index === i) {
      sliderRef.slickGoTo(i);
      //   setCurrentSlide(i);
      setDotPosition(i);
    }
    sliderRef.slickGoTo(i);
    //   setCurrentSlide(i);
    setDotPosition(i);
  };
  return (
    <section className="font-onest max-w-[1440px] mx-auto">
      {showModal && <Modal modalClose={() => setShowModal(false)} />}
      <Navbar />
      <div
        className="p-[80px] xl:px-[25px] xm:px-[16px] xm:py-[54px] bg-[#121927]"
        id="root"
      >
        <h1 className="font-medium text-[50px] sm:text-[40px] font-onest text-[#FFFFFF] leading-[60px] sm:leading-[44px] text-center w-[742px] sm:w-[80%] xm:w-[100%] mx-auto mb-[8px]">
          Discover Exceptional Talents for Your Team
        </h1>
        <p className="w-[768px] md:w-[100%] text-[20px] text-[#EAECF0] tracking-[-0.25%] leading-[24px] text-center mx-auto mb-[32px]">
          Connect with skilled professionals and drive innovation in your
          projects effortlessly. Hire exceptional talents to build your
          competent and dynamic team today!
        </p>
        <div className=" flex justify-center xm:flex-col  gap-[24px] sm:gap-[8px]">
          <button
            className="w-[173px] xm:w-full h-[56px] rounded-[8px] bg-[#1453FF] text-[#FAFAFA]"
            onClick={handleHire}
          >
            Hire Now
          </button>
          {/* <button className='w-[173px] xm:w-full h-[56px] rounded-[8px] bg-[#FAFAFA] text-[#1453FF] border-[2px] border-[#1453FF]'>
                    Book a Call
                </button> */}
          <PopupButton
            url="https://calendly.com/hackthejobsofficial/30min"
            rootElement={rootElement}
            text="Book a Call"
            className="w-[173px] xm:w-full h-[56px] rounded-[8px]  text-[#FAFAFA] border-[2px]"
          />
        </div>
      </div>
      {/* <div className="bg-[#F9F9F9] px-[80px] xl:px-[25px] xm:px-[16px] py-[40px]">
        <h2 className="font-medium text-[32px] text-[#121927] leading-[38px] text-center">
          Trusted by Top Brands
        </h2>
        <p className="w-[689px] sm:w-[100%] font-normal text-[16px] text-[#4F5452] text-center leading-[24px] tracking-[-0.5%] mt-[8px] mb-[32px] mx-auto">
          Here are some of the brands that believe in our talents.
        </p>
        <div className="sm:hidden flex justify-between items-center">
          <Image src="/figma.png" alt="company logo" width={40} height={60} />
          <Image src="/stripe.png" alt="company logo" width={124} height={60} />
          <Image src="/slack.png" alt="company logo" width={232} height={60} />
          <Image
            src="/spotify.png"
            alt="company logo"
            width={196}
            height={60}
          />
          <Image src="/google.png" alt="company logo" width={188} height={60} />
          <Image
            src="/hire-apple.png"
            alt="company logo"
            width={59}
            height={72}
          />
        </div>
        <div className="hidden sm:block  w-[100%] mx-auto px-[16px]">
          <Slider
            ref={(slider) => {
              sliderRef = slider;
            }}
            {...logoSettings}
            className=""
          >
            <div className="pl-[10px]">
              <Image
                src="/stripe-mobile.png"
                alt="company logo"
                width={71}
                height={34}
              />
            </div>
            <div className="pl-[10px]">
              <Image
                src="/slack-mobile.png"
                alt="company logo"
                width={131}
                height={34}
              />
            </div>
            <div className="pl-[10px]">
              <Image
                src="/spotify-mobile.png"
                alt="company logo"
                width={110}
                height={34}
              />
            </div>
            <div className="pl-[10px]">
              <Image
                src="/google-mobile.png"
                alt="company logo"
                width={107}
                height={34}
              />
            </div>
          </Slider>
        </div>
      </div> */}
      <div className="bg-[bg-[#FBFCFF]]">
        <div className="px-[80px] xl:px-[25px] lgx:px-[25px] sm:px-[16px] bg-[#FBFCFF] pt-[100px] sm:pt-[64px]">
          <h3 className="w-[768px] md:w-[100%] font-medium text-[48px] sm:text-[32px] text-[#101828] leading-[52.8px] sm:leading-[35.2px] ">
            Why hire at Hackthejobs?
          </h3>
          <div className="my-[64px] sm:my-[24px] rounded-[16px] border-[1px] border-[transparent] overflow-hidden">
            <div className="">
              <Image
                src="/about-story.png"
                width={1280}
                height={432}
                alt=""
                className="sm:hidden"
              />
              <Image
                src="/about-story2.png"
                width={768}
                height={294}
                alt=""
                className="hidden sm:block"
              />
            </div>
            {/* <div className='bg-[#1453FF] py-[20px] flex flex-wrap gap-[48px] px-[40px]'> */}
            <div className="bg-[#1453FF] py-[20px] flex flex-wrap justify-between sm:justify-around px-[40px] xl:px-[16px] xxxm:px-[8px]">
              {hirePitch.map((element, i) => (
                // (<div key={i} style={{backgroundColor: changeStyle === i?'white':'#1453FF', dropShadow: changeStyle === i? '1px 1px 8px 0 rgba(255, 255, 255, 0.1)': '', borderRadius: changeStyle === i? '8px': ''}} className='w-[368px] p-[16px]' onMouseOver={() => handleMouseOver(i)} onMouseOut={() => handleMouseOut(i)}>
                <div
                  key={i}
                  style={{
                    backgroundColor: changeStyle === i ? "white" : "#1453FF",
                    dropShadow:
                      changeStyle === i
                        ? "1px 1px 8px 0 rgba(255, 255, 255, 0.1)"
                        : "",
                    borderRadius: changeStyle === i ? "8px" : "",
                  }}
                  className="w-[32%] lg:w-[48%] sm:w-[100%] p-[16px] xl:px-[8px] mb-[18px] align-center"
                  onMouseOver={() => handleMouseOver(i)}
                  onMouseOut={() => handleMouseOut(i)}
                >
                  {changeStyle === i ? (
                    <Image
                      src={element.imageHover}
                      width={48}
                      height={48}
                      alt=""
                    />
                  ) : (
                    <Image src={element.image} width={48} height={48} alt="" />
                  )}
                  <h4
                    style={{ color: changeStyle === i ? "#121927" : "#fff" }}
                    className="font-medium text-[24px] 1xl:text-[20px] text-[#fff] leading-[11.71px] xl:leading-[20px] mt-[24px] mb-[8px]"
                  >
                    {element.heading}
                  </h4>
                  <p
                    style={{ color: changeStyle === i ? "#787676" : "#fff" }}
                    className="font-normal text-[16px] text-[#fff] leading-[24px] "
                  >
                    {element.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* <section className="font-onest bg-[#FBFCFF] px-[80px] xl:px-[25px] sm:px-[16px] pb-[100px] sm:pb-[64px] relative">
        
          <div className="w-[100%]">
            <Slider
              ref={(slider) => {
                sliderRef = slider;
              }}
              {...settings}
              className="w-[100%]"
            >
              {hireTestimonials.map((testimonial, index) => {
                return (
                  <div
                    key={index}
                    className="w-[100%] pl-[5px] sm:pl-[0px] border-[1px] border-[#EAEAEA] rounded-[16px] overflow-hidden"
                  >
                    <div className="bg-[#fff] flex sm:flex-col justify-between relative">
                      <div className=" w-[800px] 1xl:w-[680px] xxl:w-[610px] lgx:w-[570px] lg:w-[470px] md:w-[390px] sm:w-[100%] py-[90px] sm:pt-[29.73px] sm:pb-[36.27px] pr-[56px] pl-[24px] sm:pl-[8px] sm:pr-[0px] sm:order-2">
                        <h4 className="font-normal text-[18px] leading-[32px] tracking-[-2%] text-[#787676]  mb-[32px] sm:mb-[24px]">
                          {testimonial.text}
                        </h4>
                        <h5 className="font-medium  sm:w-[100%] text-[18px] leading-[28px] text-[#787676]">
                          {testimonial.name}
                        </h5>
                        <p className="font-normal text-[16px] leading-[24px] text-[#BEBEBE] pb-[32px]">
                          {testimonial.position}
                        </p>
                        <div className="flex sm:justify-center gap-4">
                          {[...Array(hireTestimonials.length).keys()].map(
                            (_, i) => (
                              <div
                                key={i}
                                className={`w-[10px] h-[10px] rounded-[6px] ${
                                  dotPosition === i
                                    ? "bg-[#1453FF]"
                                    : "bg-[#667085]"
                                }`}
                                onClick={() => goToSlide(index, i)}
                              ></div>
                            )
                          )}
                        </div>
              
                      </div>
                      <div>
                        <Image
                          src="/testimonial.png"
                          width={480}
                          height={465}
                          alt="testimonial picture"
                          className="sm:order-1 max-w-[100%] h-[100%] object-cover"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </Slider>
          </div>
        </section> */}
      </div>

      <div className="px-[80px] xl:px-[25px] xm:px-[16px] py-[80px] sm:pt-[40px] sm:pb-[64px]">
        <h4 className="font-medium w-[512px] sm:w-[60%] xm:w-[230px] text-[48px] text-center sm:text-[32px] text-[#101828] leading-[51.36px] sm:leading-[34.24px] tracking-[2%] mx-auto mb-[16px]">
          Get Started in 3 Steps
        </h4>
        <p className="font-normal w-[430px] sm:w-[100%] text-[16px] text-[#667085] text-center leading-[24px] mx-auto mb-[48px]">
          Follow these steps to attract, evaluate, and hire the right talent for
          your team.
        </p>
        <div className="flex flex-wrap justify-between sm:justify-around mb-[32px]">
          {hireSteps.map((hireStep, i) => (
            // (<div style={{backgroundColor: hireStep.bg}} className='w-[409px] py-[40px] px-[32px] rounded-[8px] border-[#FFFBF2]'>
            <div
              key={i}
              style={{ backgroundColor: hireStep.bg }}
              className="w-[32%] lg:w-[48%] sm:w-[100%] py-[40px] px-[32px] xl:px-[20px] rounded-[8px] lg:mb-[25px]"
            >
              <Image
                src={hireStep.img}
                width={45}
                height={44}
                alt=""
                className=""
              />
              <h5 className="font-medium text-[24px] text-[#101828] leading-[26.4px] mt-[32px] mb-[16px]">
                {hireStep.heading}
              </h5>
              <p className="font-normal text-[16px] text-[#545454] leading-[24px]">
                {hireStep.text}
              </p>
            </div>
          ))}
        </div>
        <button
          onClick={handleHire}
          className="w-[315px] xm:w-full  block bg-[#1453FF] rounded-[8px] px-[40px] py-[20px] text-[#fff] text-[16px] font-medium leading-[24px] tracking-[3%] mx-auto"
        >
          Hire Now
        </button>
      </div>
      <div className="px-[80px] xl:px-[25px] xm:px-[16px] py-[65px] sm:py-[50px] bg-[url(/skilled-tech.png)]">
        <h5 className="font-normal w-[567px] sm:w-[100%] text-[16px] sm:text-[12px] text-[#9FA2A0] text-center leading-[24px] tracking-[-0.5%]  mx-auto mb-[8px]">
          Access a pool of skilled talents that match your requirement
        </h5>
        <h6 className="font-medium text-[48px] sm:text-[32px] text-[#fff] leading-[57.6px] sm:leading-[38.4px] tracking-[-1%] text-center mb-[40px] sm:mb-[24px]">
          Skilled in technologies you need
        </h6>
        <div className="flex flex-wrap justify-center gap-12 md:gap-6">
          {hireSkills.map((hireSkill, i) => (
            // <p key={i} className='flex justify-center items-center font-inter font-medium w-[300px] h-[49.93]  text-[21.85px] text-[#FFFFFF] bg-[#131815] leading-[37.45px] tracking-[-0.5%] border-[1.56px] border-[#fff] rounded-[156.05px] mb-[24.97px]'>{hireSkill}</p>
            <p
              key={i}
              style={{
                backgroundColor: styleChange === i ? "#1453FF" : "",
                border:
                  styleChange === i
                    ? "1.56px solid #1976D2"
                    : "1.56px solid #fff",
              }}
              onMouseOver={() => handleSkillMouseOver(i)}
              onMouseOut={() => handleSkillMouseOut(i)}
              className="flex justify-center items-center font-inter font-medium w-[23.4%] xl:w-[32%] sm:w-[48%] ssxm:w-[100%] h-[49.93]  text-[21.85px] lg:text-[18px] md:text-[16px] xm:text-[14px] text-[#FFFFFF] bg-[#131815] leading-[37.45px] tracking-[-0.5%] border-[1.56px] border-[#fff] rounded-[156.05px] mb-[24.97px] sm:mb-0"
            >
              {hireSkill}
            </p>
          ))}
        </div>
      </div>
      <section className="px-[80px] xl:px-[25px] xm:px-[16px] pt-[80px] sm:pt-[40px]">
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
      <Footer openModal={() => setShowModal(true)} />
    </section>
  );
};

export default Hire;
