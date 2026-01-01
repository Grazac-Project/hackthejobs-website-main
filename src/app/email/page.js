"use client";

import React from "react";
import Image from "next/image";
import Classes from "./email.module.css";

const page = () => {
  return (
    <div className={Classes.container}>
      <div>
        <Image
          src="hackthejobs.svg"
          alt="icon"
          width={164.204}
          height={36}
          style={{ margin: "40px" }}
        />
        <div className={Classes.innerContainer}>
          <div className={Classes.content}>
            <h3>Email verification</h3>
            <p>
              We are happy to have you back. Provide the correct information.
            </p>
            <div className={Classes.pinflex}>
              <div className={Classes.pin}>7</div>
              <div className={Classes.pin}>9</div>
              <div className={Classes.pin}>4</div>
              <div className={Classes.pin}>4</div>

            </div>
            <button className={Classes.btn}>Verify email</button>
            <a href="login">
              <div className={Classes.back}>
                <Image src="arrow-left.svg" alt="icon" width={20} height={20} />
                Back to log in
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
