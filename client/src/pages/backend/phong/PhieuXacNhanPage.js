import React from "react";
import Controller from "../../../components/quanly/phieuxacnhan/Controller";
import PhieuDoiPhong from "../../../components/quanly/phieuxacnhan/PhieuDoiPhong";
import PhieuHuyPhong from "../../../components/quanly/phieuxacnhan/PhieuHuyPhong";

const PhieuXacNhanPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">QUẢN LÝ PHIẾU XÁC NHẬN</h1>
      <Controller />
      <PhieuDoiPhong />
      <PhieuHuyPhong />
    </div>
  );
};

export default PhieuXacNhanPage;
