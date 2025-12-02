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
const productId = ({onClick}) => {
      const router = useRouter();
  const { productId } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);


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
              onClick={onClick}
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
                style={{ backgroundImage: `url(${product.thumbnail})` }}
              />
            </div>
            <div className="flex flex-col w-[411px]">
              <h3 className="text-[24px] font-semibold mb-4 truncate">
                {productTitle || "Digital Product"}
              </h3>
              <div className="flex items-center gap-[10px] mb-[12px]">
                <span className="text-xs bg-[#DEA8061A] text-[#DEA806] px-3 py-1 rounded-[32px] font-medium">
                  {category || ""}
                </span>
                <button className="flex items-center gap-[4.87px] bg-[#3333331A] rounded-[38.96px] py-[5.37px] px-[14.61px] sxm:px-3">
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
                {productDescription || ""}
                <button
                  onClick={() => router.push(`/digital-products/${productId}`)}
                  className="text-primary underline mt-[16px]"
                >
                  View more
                </button>
              </div>
              <div className="flex justify-between items-center border border-[#EAEAEA] bg-[#FAFAFA] p-[16px] rounded-[8px] mt-[99px]">
                <div className="text-[18px] font-bold text-[#333333]">
                  {productType === "paid"
                    ? `${productCurrency === "NGN" ? "₦" : "$"}${formatPrice(
                        productPrice
                      )}`
                    : "Free"}
                </div>
                <button
                  className="text-sm text-[#fff] bg-primary px-3 py-[10px] w-[182px] rounded-[6.29px] font-bold truncate"
                  // onClick={handleClick}
                  onClick={handleShowCheckout}
                >
                  {loading}
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
    </div>
  );
};

export default productId;
