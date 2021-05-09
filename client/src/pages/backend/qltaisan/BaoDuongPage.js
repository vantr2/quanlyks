import React from "react";
import DanhSachBaoDuong from "../../../components/quanly/baoduong/DanhSachBaoDuong";
import ThemBaoDuong from "../../../components/quanly/baoduong/ThemBaoDuong";

const BaoDuongPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">BẢO DƯỠNG TÀI SẢN</h1>
      <ThemBaoDuong />
      <DanhSachBaoDuong />
    </div>
  );
};

export default BaoDuongPage;
