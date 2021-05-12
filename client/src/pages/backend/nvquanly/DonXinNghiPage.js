import React from "react";
import DanhSachCho from "../../../components/quanly/duyetdon/DanhSachCho";
import DanhSachDaDuyet from "../../../components/quanly/duyetdon/DanhSachDaDuyet";

const DonXinNghiPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">Duyệt đơn xin nghỉ</h1>
      <DanhSachCho />
      <DanhSachDaDuyet />
    </div>
  );
};

export default DonXinNghiPage;
