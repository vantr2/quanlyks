import React, { useState } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";

const ThayDoiTrangThaiTaiKhoan = ({ trangthai, ten }) => {
  const [trangThai, setTrangThai] = useState(trangthai);
  const renderTrangThai = (tt) => {
    if (tt) {
      return <i className="fas fa-dot-circle text-success"></i>;
    } else {
      return <i className="fas fa-dot-circle"></i>;
    }
  };

  const handleChangeStatus = async (e, username) => {
    e.stopPropagation();
    try {
      await TaiKhoanFinder.put("/thay-doi-trang-thai-nguoi-dung", {
        ten: username,
        trangthai: !trangThai,
      });
      //   console.log(trangThai);
      setTrangThai(!trangThai);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <div
        onClick={(e) => {
          handleChangeStatus(e, ten);
        }}
      >
        {renderTrangThai(trangThai)}
      </div>
    </div>
  );
};

export default ThayDoiTrangThaiTaiKhoan;
