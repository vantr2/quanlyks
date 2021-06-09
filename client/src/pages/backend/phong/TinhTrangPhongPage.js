import React from "react";
import DanhSachDatPhong from "../../../components/quanly/datphong/DanhSachDatPhong";
import DanhSachPhong from "../../../components/quanly/datphong/DanhSachPhong";

const TinhTrangPhongPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">Tình trạng phòng</h1>
      <DanhSachPhong />
      <DanhSachDatPhong />
    </div>
  );
};

export default TinhTrangPhongPage;
