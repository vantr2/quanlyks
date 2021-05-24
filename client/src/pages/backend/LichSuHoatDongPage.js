import React from "react";
import DanhSachLichSu from "../../components/quanly/lshoatdong/DanhSachLichSu";
import LocTheoTaiKhoan from "../../components/quanly/lshoatdong/LocTheoTaiKhoan";

const LichSuHoatDongPage = () => {
  const userrole = window.localStorage.getItem("user_role");
  return (
    <div className="mt-5">
      <h1 className="text-center">LỊCH SỬ HOẠT ĐỘNG</h1>
      {userrole === "QL" || userrole === "Admin" ? <LocTheoTaiKhoan /> : ""}
      <DanhSachLichSu />
    </div>
  );
};

export default LichSuHoatDongPage;
