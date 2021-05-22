import React, { useEffect, useState } from "react";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import { useHistory } from "react-router";
import { NormalizeDate, NumberFormat } from "../../../utils/DataHandler";
import XoaHoaDon from "./XoaHoaDon";
import SuaHoaDon from "./SuaHoaDon";

const DanhSachHoaDon = () => {
  let hi = useHistory();
  const userrole = window.localStorage.getItem("user_role");
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

  return (
    <div>
      <div className="mt-5 mb-5">
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Mã hóa đơn</th>
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
                  <td className="align-middle text-center">{hoadon.id}</td>
                  <td className="align-middle">{hoadon.kh_name}</td>
                  <td className="text-center ">
                    {NormalizeDate(hoadon.ngaylap)}
                  </td>
                  <td className="align-middle">
                    {hoadon.trangthai === 0 ? (
                      <i className="fas fa-ban text-danger"></i>
                    ) : (
                      <i className="far fa-check-circle text-success"></i>
                    )}{" "}
                    &nbsp;
                    {hoadon.trangthai === 0
                      ? "Chưa thanh toán"
                      : "Đã thanh toán"}
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
                    ) : userrole === "QL" || userrole === "Admin" ? (
                      <XoaHoaDon id={hoadon.id} />
                    ) : (
                      ""
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
