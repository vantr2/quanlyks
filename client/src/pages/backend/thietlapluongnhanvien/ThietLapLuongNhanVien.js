import React, { useState } from "react";
import ThietLapLuongNhanVienTheoThang from "./ThietLapLuongNhanVienTheoThang";
import host from "../../../hosts/Host";
function QuanLyLuongNhanVien() {
  const [DLLuongNhanVien, SetDLLuongNhanVien] = useState([]);
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(host.HienThiCaNhanVien);
      const JsonData = await response.json();
      SetDLLuongNhanVien(JsonData);
      console.log(JsonData);
    };
    fetchData();
  }, []);
  return (
    <React.Fragment>
      <h1 className="text-center mt-5 mb-4">THIẾT LẬP LƯƠNG NHÂN VIÊN</h1>
      {/* <div className="breadcrumbs">
        <div className="breadcrumbs-inner">
          <div className="row m-0">
            <div className="col-sm-4">
              <div className="page-header float-left">
                <div className="page-title">
                  <h1>Quản lý lương nhân viên</h1>
                </div>
              </div>
            </div>
            <div className="col-sm-8">
              <div className="page-header float-right">
                <div className="page-title">
                  <ol className="breadcrumb text-right">
                    <li>
                      <a href="#">Quản trị viên</a>
                    </li>
                    <li>
                      <a href="#">Quản lý lương nhân viên</a>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <ThietLapLuongNhanVienTheoThang
        DLLuongNhanVien={DLLuongNhanVien}
      ></ThietLapLuongNhanVienTheoThang>

      {/* <ThietLapLuongNhanVienTheoThang></ThietLapLuongNhanVienTheoThang> */}
    </React.Fragment>
  );
}

export default QuanLyLuongNhanVien;
