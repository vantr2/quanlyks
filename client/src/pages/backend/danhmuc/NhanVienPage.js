import React from "react";
import DanhSachNhanVien from "../../../components/quanly/nhanvien/DanhSachNhanVien";
import ThemNhanVien from "../../../components/quanly/nhanvien/ThemNhanVien";

const NhanVienPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ NHÂN VIÊN</h1>
      <ThemNhanVien />
      <DanhSachNhanVien />
    </div>
  );
};

export default NhanVienPage;
