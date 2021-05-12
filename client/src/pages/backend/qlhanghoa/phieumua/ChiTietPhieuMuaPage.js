import React from "react";
import ChiTietPhieuMua from "../../../../components/quanly/phieumua/ChiTietPhieuMua";
import DanhSachPhieuMuaChiTiet from "../../../../components/quanly/phieumua/DanhSachPhieuMuaChiTiet";
import ThemPhieuMuaChiTiet from "../../../../components/quanly/phieumua/ThemPhieuMuaChiTiet";

const ChiTietPhieuMuaPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">Chi tiết phiếu mua</h1>
      <ThemPhieuMuaChiTiet />
      <DanhSachPhieuMuaChiTiet />
      <ChiTietPhieuMua />
    </div>
  );
};

export default ChiTietPhieuMuaPage;
