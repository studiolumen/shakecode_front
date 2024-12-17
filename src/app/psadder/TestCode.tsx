import { useRef } from "react";

const TestCode = () => {
  const frame = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={frame}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",

          margin: "20px",
          border: "6px solid #FFF",
          borderRadius: "10px",
          backgroundColor: "#EEE",

          color: "#000",
          fontSize: "24px",

          pointerEvents: "none",
        }}>
        여기에 드롭
      </div>
    </>
  );
};

export default TestCode;
