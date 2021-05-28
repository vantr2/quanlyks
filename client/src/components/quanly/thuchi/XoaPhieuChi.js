import React from "react";

const XoaPhieuChi = ({ pc }) => {
  return (
    <div>
      <i
        className="fas fa-trash text-danger"
        data-toggle="modal"
        data-target={`#id${pc.id}xoaphieuchi`}
      >
        &nbsp;Xóa
      </i>
    </div>
  );
};

export default XoaPhieuChi;
