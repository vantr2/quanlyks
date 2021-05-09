import React from "react";
import ChiTietBaoDuong from "../../../../components/quanly/baoduong/ChiTietBaoDuong";
import DanhSachTaiSanBaoDuong from "../../../../components/quanly/baoduong/DanhSachTaiSanBaoDuong";
import ThemTaiSanBaoDuong from "../../../../components/quanly/baoduong/ThemTaiSanBaoDuong";

const ChiTietBaoDuongPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">Chi tiết bảo dưỡng tài sản</h1>
      <ThemTaiSanBaoDuong />
      <DanhSachTaiSanBaoDuong />
      <ChiTietBaoDuong />
    </div>
  );
};

export default ChiTietBaoDuongPage;
