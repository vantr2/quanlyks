import React from "react";
import DanhSachDichVu from "../../../components/quanly/dichvu/DanhSachDichVu";
import ThemDichVu from "../../../components/quanly/dichvu/ThemDichVu";

const DichVuPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ DỊCH VỤ</h1>
      <ThemDichVu />
      <DanhSachDichVu />
    </div>
  );
};

export default DichVuPage;
