import React from "react";
import DanhSachTaiSan from "../../../components/quanly/taisan/DanhSachTaiSan";
import ThemTaiSan from "../../../components/quanly/taisan/ThemTaiSan";

const TaiSanPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ TÀI SẢN</h1>
      <ThemTaiSan />
      <DanhSachTaiSan />
    </div>
  );
};

export default TaiSanPage;
