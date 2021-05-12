import React from "react";
import DanhSachPhieuMua from "../../../components/quanly/phieumua/DanhSachPhieuMua";
import ThemPhieuMua from "../../../components/quanly/phieumua/ThemPhieuMua";

const PhieuMuaPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">PHIẾU MUA HÀNG</h1>
      <ThemPhieuMua />
      <DanhSachPhieuMua />
    </div>
  );
};

export default PhieuMuaPage;
