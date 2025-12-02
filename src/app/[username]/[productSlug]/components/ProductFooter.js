import Image from "next/image";
import Link from "next/link";

const ProductFooter = () => {
  const isProduction = process.env.NEXT_PUBLIC_DOMAIN_DEV;
  const baseUrl =
    isProduction === "development"
      ? "https://test-dashboard.hackthejobs.com"
      : "https://dashboard.hackthejobs.com";

  return (
    <div className="font-satoshi minmd:flex-row minmd:justify-between minmd:items-center text-center  flex flex-col justify-center w-[1084px] xl:w-[95%] min-h-[212px]  m-auto">
      <div className="flex items-center gap-1 sm:pb-[10px] sm:justify-center">
        <p className="minmd:mb-0   text-[20px] uppercase text-[#878787]">
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
        <button className="bg-[#000] text-[#fff] px-14 py-4 items-center rounded-lg">
          Create my own page
        </button>
      </Link>
    </div>
  );
};

export default ProductFooter;
