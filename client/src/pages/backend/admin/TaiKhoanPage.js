import React from "react";

import DanhSachTaiKhoan from "../../../components/quanly/taikhoan/DanhSachTaiKhoan";
import ThemNguoiDung from "../../../components/quanly/taikhoan/ThemNguoiDung";

const TaiKhoanPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center text-uppercase mb-4">Quản lý tài khoản</h1>
      <ThemNguoiDung />
      <DanhSachTaiKhoan />
    </div>
  );
};

export default TaiKhoanPage;
