import React from "react";

const FrontEnd = () => {
  return (
    <div>
      <button
        className="btn btn-link"
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = "/quan-ly";
        }}
      >
        Backend
      </button>
    </div>
  );
};

export default FrontEnd;
