import React, { useContext, useEffect, useState } from "react";
import KhachHangFinder from "../../../apis/KhachHangFinder";
import XoaKhachHang from "./XoaKhachHang";
import { useHistory } from "react-router";
import { NumberFormat } from "../../../utils/DataHandler";
import { AccountContext } from "../../../contexts/AccountContext";
const DanhSachKhachHang = () => {
  let hi = useHistory();
  const { msgKHActionSuccess, msgKHActionError } = useContext(AccountContext);
  const [dsKh, setDsKH] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await KhachHangFinder.get("/danh-sach");
        setDsKH(res.data.data.khachhang);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const userrole = window.localStorage.getItem("user_role");

  const handleKHSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/khach-hang/${id}`);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <p className="text-success">{msgKHActionSuccess}</p>
        <p className="text-danger">{msgKHActionError}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Tên khách hàng</th>
              <th>Giới tinh</th>
              <th>Số điện thoại</th>
              <th>Chứng minh nhân dân</th>
              <th>Tài khoản</th>
              <th>Kiểu KH</th>
              <th>Xem</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsKh.map((khachhang) => {
              return (
                <tr key={khachhang.id} className="text-center">
                  <td className="align-middle">{khachhang.ten}</td>
                  <td className="text-center ">
                    {khachhang.gioitinh === 0
                      ? "Nam"
                      : khachhang.gioitinh === 1
                      ? "Nữ"
                      : "KXD"}
                  </td>
                  <td className="align-middle">{khachhang.sdt}</td>
                  <td className="text-center align-middle">
                    {NumberFormat(khachhang.cmnd)}
                  </td>

                  <td className="align-middle">{khachhang.account}</td>
                  <td className="align-middle">
                    {khachhang.kieukhachhang_name}
                  </td>

                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleKHSelected(e, khachhang.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {userrole === "QL" || userrole === "Admin" ? (
                      <XoaKhachHang id={khachhang.id} name={khachhang.ten} />
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

export default DanhSachKhachHang;
