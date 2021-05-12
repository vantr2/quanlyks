import React from "react";
import DanhSachXinNghi from "../../../components/quanly/xinnghi/DanhSachXinNghi";
import ThemXinNghi from "../../../components/quanly/xinnghi/ThemXinNghi";

const XinNghiPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ NHÂN VIÊN XIN NGHỈ</h1>
      <ThemXinNghi />
      <DanhSachXinNghi />
    </div>
  );
};

export default XinNghiPage;
