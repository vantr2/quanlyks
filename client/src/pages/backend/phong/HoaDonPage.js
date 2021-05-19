import React from "react";
import DanhSachHoaDon from "../../../components/quanly/hoadon/DanhSachHoaDon";
import LapHoaDon from "../../../components/quanly/hoadon/LapHoaDon";

const HoaDonPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ HÓA ĐƠN</h1>
      <LapHoaDon />
      <DanhSachHoaDon />
    </div>
  );
};

export default HoaDonPage;
