import React, { useState } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import ThemLichSu from "../../../utils/ThemLichSu";

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
      if (trangThai) {
        ThemLichSu({
          doing: "Thay đổi trạng thái",
          olddata: {
            old: {
              ten: username,
              trangthai: "Bật",
            },
          },
          newdata: {
            new: {
              ten: username,
              trangthai: "Tắt",
            },
          },
          tbl: "Người dùng",
        });
      } else {
        ThemLichSu({
          doing: "Thay đổi trạng thái",
          olddata: {
            old: {
              ten: username,
              trangthai: "Tắt",
            },
          },
          newdata: {
            new: {
              ten: username,
              trangthai: "Bật",
            },
          },
          tbl: "Người dùng",
        });
      }
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
