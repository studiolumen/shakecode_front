"use client";

import React, { FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";

import CanvasEffect from "@/app/login/CanvasEffect";
import { AuthApi } from "@/lib/api";

import "./style.css";

const Login = () => {
  const container = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const showSignUp = () => {
    container.current?.classList.add("right-panel-active");
  };

  const hideSignUp = () => {
    container.current?.classList.remove("right-panel-active");
  };

  const signIn = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast
      .promise(AuthApi.passwordLogin(email, password), {
        pending: "로그인중...",
        success: "로그인 성공",
        error: "로그인 실패",
      })
      .then(() => {
        const urlSplit = location.href.split("?");
        if (urlSplit.length == 2 && urlSplit[1]) {
          const query = urlSplit[1].split("&");
          const redirect = query.find((q) => q.startsWith("redirect="));
          if (redirect && redirect.split("=")[1]) {
            location.href = redirect.split("=")[1];
            return;
          }
        }
        location.href = "/";
      });
  };

  const signUp = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    toast
      .promise(AuthApi.register(name, email, nickname, password), {
        pending: "회원가입중...",
        success: "회원가입 성공",
        error: "회원가입 실패",
      })
      .then(() => {
        toast("로그인 해주세요");
        hideSignUp();
      })
      .catch(() => {
        toast("관리자에게 문의해주세요");
      });
  };

  const forgetPassword = () => {
    alert("Do not use this service");
  };

  return (
    <>
      <CanvasEffect />
      <div ref={container} className="container" id="container">
        <div className="form-container sign-up-container">
          <form id="signUpForm" onSubmit={signUp}>
            <h1>계정 만들기</h1>
            <span>환영합니다!</span>
            <input
              type="text"
              id="name"
              placeholder="이름"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setName((e.target as HTMLInputElement).value)
              }
              value={name}
              required
            />
            <input
              type="text"
              id="id"
              placeholder="아이디"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setNickname((e.target as HTMLInputElement).value)
              }
              value={nickname}
              required
            />
            <input
              type="email"
              id="email"
              placeholder="이메일 주소"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              value={email}
              required
            />
            <div className="password-container">
              <input
                type="password"
                id="password"
                placeholder="비밀번호"
                onInput={(e: FormEvent<HTMLInputElement>) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
                value={password}
                required
              />
            </div>
            <ul id="passwordCriteria">
              <li id="lengthCriteria">8글자 이상이 필요합니다</li>
              <li id="uppercaseCriteria">대문자가 하나 이상 필요합니다</li>
              <li id="numberCriteria">숫자가 하나 이상 필요합니다</li>
              <li id="specialCharCriteria">특수기호가 필요합니다(!@#$%^&*)</li>
            </ul>
            <button type="submit" className="und">
              회원 가입
            </button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={signIn}>
            <h1>로그인</h1>
            <span className="under">반갑습니다!</span>
            <input
              type="email"
              placeholder="이메일 또는 이름"
              onInput={(e: FormEvent<HTMLInputElement>) =>
                setEmail((e.target as HTMLInputElement).value)
              }
              value={email}
              required
            />
            <div className="password-container">
              <input
                type="password"
                id="loginPassword"
                placeholder="비밀번호"
                onInput={(e: FormEvent<HTMLInputElement>) =>
                  setPassword((e.target as HTMLInputElement).value)
                }
                value={password}
                required
              />
              <i id="toggleLoginPassword" className="fas fa-eye"></i>
            </div>
            <a onClick={forgetPassword}>비밀번호를 잊으셨나요?</a>
            <button type="submit" className="und">
              로그인
            </button>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>
                Greetings, <br /> New shaker!
              </h1>
              <p>이미 계정이 있으신가요?</p>
              <button className="ghost" onClick={hideSignUp}>
                로그인하기
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Welcome back!</h1>
              <p>계정이 없으신가요?</p>
              <button className="ghost" onClick={showSignUp}>
                새 계정 만들기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
