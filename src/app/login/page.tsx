"use client";

import React, { useRef } from "react";

import "./style.css";

const Login = () => {
  const container = useRef<HTMLDivElement>(null);

  const showSignUp = () => {
    container.current &&
      (container.current as HTMLElement).classList.add("right-panel-active");
  };

  const hideSignUp = () => {
    container.current &&
      (container.current as HTMLElement).classList.remove("right-panel-active");
  };

  return (
    <>
      <div ref={container} className={"container"}>
        <div className={"form-container sign-up-container"}>
          <form>
            <h1>Create Account</h1>
            <span>Greetings</span>
            <input type={"text"} placeholder={"Name"} required />
            <input type={"text"} placeholder={"Nickname"} required />
            <input type={"email"} id={"email"} placeholder={"Email"} required />
            <input type={"password"} placeholder={"Password"} required />
            <p className={"text-red-600 hidden text-sm"}>
              Password must be at least 8 characters, include an uppercase
              letter, a number, and a special character.
            </p>
            <button type={"submit"}>Sign Up</button>
          </form>
        </div>
        <div className={"form-container sign-in-container"}>
          <form>
            <h1>Log-In</h1>
            <span className={"under"}>Welcome Back</span>
            <input type={"email"} placeholder={"Email"} required />
            <input type={"password"} placeholder={"Password"} required />
            <a href={"#"}>Forgot your password?</a>
            <button type={"submit"}>Log-In</button>
          </form>
        </div>
        <div className={"overlay-container"}>
          <div className={"overlay"}>
            <div className={"overlay-panel overlay-left"}>
              <h1>
                Greetings, <br /> New shaker!
              </h1>
              <p>Jump into your field</p>
              <button className={"ghost"} onClick={() => hideSignUp()}>
                Log-In
              </button>
            </div>
            <div className={"overlay-panel overlay-right"}>
              <h1>Welcome back!</h1>
              <p>Return to your battlefield</p>
              <button className={"ghost"} onClick={() => showSignUp()}>
                Create account
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
