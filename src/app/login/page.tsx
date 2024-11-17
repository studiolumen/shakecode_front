"use client";

import { FormEvent, useRef, useState } from "react";

import { passwordLogin, register } from "@/lib/api/auth";

import "./style.css";

const Login = () => {
  const container = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showSignUp = () => {
    container.current &&
      (container.current as HTMLElement).classList.add("right-panel-active");
  };

  const hideSignUp = () => {
    container.current &&
      (container.current as HTMLElement).classList.remove("right-panel-active");
  };

  const signIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    passwordLogin(email, password)
      .then((data) => {
        alert("로그인 성공");
      })
      .catch((e) => {
        console.log(e);
        alert("로그인에 실패하였습니다");
      });
  };

  const signUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    register(name, email, nickname, password)
      .then(() => {
        alert("회원가입 성공");
      })
      .catch((e) => {
        console.log(e);
        alert("회원가입에 실패하였습니다");
      });
  };

  const forgetPassword = () => {
    alert("Do not use this service");
  };

  return (
    <>
      <div ref={container} className="container">
        <div className="form-container sign-up-container">
          <form onSubmit={signUp}>
            <h1>Create Account</h1>
            <span className={"greeting"}>Greetings</span>
            <input
              type="text"
              placeholder="Name"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setName((e.target as HTMLInputElement).value)
              }
              value={name}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="Email"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              value={email}
              required
            />
            <input
              type="text"
              placeholder="Nickname"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setNickname((e.target as HTMLInputElement).value)
              }
              value={nickname}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              value={password}
              required
            />
            <p className="passwordHint">
              Password must be at least 8 characters, include an uppercase
              letter, a number, and a special character.
            </p>
            <button type="submit" className={"signupBtn"}>
              Sign Up
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={signIn}>
            <h1>Log-In</h1>
            <span className="under">Welcome Back</span>
            <input
              type="email"
              placeholder="Email"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              value={email}
              required
            />
            <input
              type="password"
              placeholder="Password"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setPassword((e.target as HTMLInputElement).value)
              }
              value={password}
              required
            />
            <p onClick={forgetPassword}>Forgot your password?</p>
            <button type="submit">Log-In</button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>
                Greetings, <br /> New shaker!
              </h1>
              <p>Jump into your field</p>
              <button className="ghost" onClick={hideSignUp}>
                Log-In
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome back!</h1>
              <p>Return to your battlefield</p>
              <button className="ghost" onClick={showSignUp}>
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
