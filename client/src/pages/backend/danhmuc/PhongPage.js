import React from "react";
import DanhSachPhong from "../../../components/quanly/phong/DanhSachPhong";
import ThemPhong from "../../../components/quanly/phong/ThemPhong";

const PhongPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ PHÒNG</h1>
      <ThemPhong />
      <DanhSachPhong />
    </div>
  );
};

export default PhongPage;
