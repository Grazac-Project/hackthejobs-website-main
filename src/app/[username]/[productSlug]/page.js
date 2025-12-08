"use client";
import React, { useEffect, useState } from "react";
import WebinarPage from "./components/WebinerPage";
import DigitalProduct from "./components/DigitalProduct";
import { useParams } from "next/navigation";
import { getProductBySlug } from "@/api/authentication/auth";
import { Load } from "@/components/loading";
import BookingPage from "./components/bookingPage";

const productPage = () => {
  const params = useParams();

  const { username, productSlug } = params;
  const [productType, setProductType] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoader(true);
        console.log("");

        const response = await getProductBySlug(username, productSlug);

        if (response.data && response.data.data && response.data.data.data) {
          const productType = response.data.data.type; // "booking" or "webinar"
          setProductType(productType);
        } else {
          console.log("Product not found");
        }
      } catch (err) {
        console.log(err);
        console.error("Error fetching product:", err);
        console.log(
          err.response?.data?.message ||
            "Failed to load product. Please try again."
        );
      } finally {
        setLoader(false);
        console.error("Error fetching product:");
      }
    };

    if (username && productSlug) {
      fetchProductData();
    }
  }, [username, productSlug]);

  if (loader) {
    return (
      <div className="min-h-screen bg-[#F2F2F7] flex items-center justify-center">
        <Load />
      </div>
    );
  }
  if (productType.toLowerCase() === "booking") {
    return <BookingPage />;
  } else if (productType.toLowerCase() === "webinar") {
    return <WebinarPage />;
  } else {
    // Default to DigitalProduct for 'digital_product' or any other type
    return <DigitalProduct />;
  }
};

export default productPage;
