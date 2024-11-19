"use client";

import React, { useEffect, useRef } from "react";

const CanvasEffect = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    c.height = window.innerHeight;
    c.width = window.innerWidth;

    const font_size = 15;
    const columns = c.width / font_size;
    const drops = Array.from({ length: columns }, () => 1);

    const defineRandomChar = () => {
      const charSet =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return charSet.charAt(Math.floor(Math.random() * charSet.length));
    };

    const draw = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.fillStyle = "#fff";
      ctx.font = font_size + "px arial";

      for (let i = 0; i < drops.length; i++) {
        const text = defineRandomChar();
        ctx.fillText(text, i * font_size, drops[i] * font_size);

        if (drops[i] * font_size > c.height && Math.random() > 0.975)
          drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} id="c" />;
};

export default CanvasEffect;
