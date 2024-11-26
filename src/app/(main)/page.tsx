"use client";

import Image from "next/image";
import { useEffect } from "react";

import "./style.css";

const Home = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".logo, .divider, .navigation");
    elements.forEach((el, index) => {
      setTimeout(() => {
        const element = el as HTMLElement;
        if (element.classList.contains("divider")) {
          element.style.animation = "grow 1s ease forwards";
        } else {
          element.style.animation = "fadeIn 1s ease forwards";
        }
      }, index * 500);
    });
  }, []);

  return (
    <>
      <div className="container">
        <div className="logo">
          {/* height auto */}
          <Image
            src={"/logo.svg"}
            alt="SHAKECODE"
            width={0}
            height={0}
            style={{ width: "300px", height: "100%" }}
          />
        </div>
        <div className="divider"></div>
        <div className="navigation">
          <p>
            Navigate to{" "}
            <a href="#">
              <strong>SHAKECODE</strong>
            </a>
          </p>
          <p>
            Navigate to{" "}
            <a href="#">
              <strong>
                SHAKECODE <span className="edu">EDU</span>
              </strong>
            </a>
          </p>
          <p>
            Navigate to{" "}
            <a href="/psadder">
              <strong>
                SHAKECODE <span className="psadder">PSAdder</span>
              </strong>
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Home;
