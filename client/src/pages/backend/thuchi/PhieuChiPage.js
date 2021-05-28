import React from "react";
import PhieuChi from "../../../components/quanly/thuchi/PhieuChi";
import ThemPhieuChi from "../../../components/quanly/thuchi/ThemPhieuChi";
const PhieuChiPage = () => {
  return (
    <div className="mt-5">
      <h1 className="text-center">Phiếu Chi</h1>
      <ThemPhieuChi />
      <PhieuChi />
    </div>
  );
};

export default PhieuChiPage;
