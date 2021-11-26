import React from "react";

const Button = ({ children, handleButton }) => (
  <div>
    <button
      onClick={handleButton}
      style={{
        cursor: "pointer",
        margin: "5px",
        fontSize: "15px",
      }}
    >
      {children}{" "}
    </button>
  </div>
);

export default Button;
