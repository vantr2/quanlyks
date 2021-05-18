import React from "react";
import ThongTinDatPhong from "../../../../components/quanly/datphong/ThongTinDatPhong";
import ThongTinKhachHang from "../../../../components/quanly/datphong/ThongTinKhachHang";

const DatPhongPage = () => {
  return (
    <div className="row mt-5">
      <div className="col border border-top-0 border-bottom-0 border-left-0">
        <ThongTinKhachHang />
      </div>
      <div className="col border border-top-0 border-bottom-0 border-right-0">
        <ThongTinDatPhong />
      </div>
    </div>
  );
};

export default DatPhongPage;
