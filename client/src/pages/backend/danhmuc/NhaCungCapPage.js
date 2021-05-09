import React from "react";
import DanhSachNcc from "../../../components/quanly/nhacungcap/DanhSachNcc";
import ThemNcc from "../../../components/quanly/nhacungcap/ThemNcc";

const NhaCungCapPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ NHÀ CUNG CẤP</h1>
      <ThemNcc />
      <DanhSachNcc />
    </div>
  );
};

export default NhaCungCapPage;
