import React, { useEffect, useState } from "react";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import { useHistory } from "react-router";
import { NormalizeDate, NumberFormat } from "../../../utils/DataHandler";
import XoaHoaDon from "./XoaHoaDon";
import SuaHoaDon from "./SuaHoaDon";

const DanhSachHoaDon = () => {
  let hi = useHistory();
  const [dsHoaDon, setDsHoaDon] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await HoaDonFinder.get("/danh-sach");
        if (res.data.status === "ok") {
          setDsHoaDon(res.data.data.hoadon);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsHoaDon]);

  const handleHoaDonSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/phong/hoa-don/${id}`);
  };

  const renderTrangThaiHoaDon = (tt) => {
    let result = "";
    switch (tt + "") {
      case "1":
        result = "Đã thanh toán";
        break;
      case "0":
        result = "Chưa thanh toán";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Khách hàng</th>
              <th>Ngày lập</th>
              <th>Trạng thái</th>
              <th>Người lập</th>
              <th>Tổng tiền</th>
              <th>HTTT</th>
              <th>Xem</th>
              <th>Xóa/Sửa</th>
            </tr>
          </thead>
          <tbody>
            {dsHoaDon.map((hoadon) => {
              return (
                <tr key={hoadon.id}>
                  <td className="align-middle">{hoadon.kh_name}</td>
                  <td className="text-center ">
                    {NormalizeDate(hoadon.ngaylap)}
                  </td>
                  <td className="align-middle">
                    {renderTrangThaiHoaDon(hoadon.trangthai)}
                  </td>

                  <td className="align-middle">{hoadon.nv_name}</td>
                  <td className="text-right align-middle">
                    {NumberFormat(hoadon.tongtien)} <b>VND</b>
                  </td>
                  <td className="align-middle">
                    {hoadon.hinhthuctt === 1 ? "Tiền mặt" : "Chuyển khoản"}
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleHoaDonSelected(e, hoadon.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {hoadon.trangthai === 0 ? (
                      <SuaHoaDon id={hoadon.id} />
                    ) : (
                      <XoaHoaDon id={hoadon.id} />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DanhSachHoaDon;
