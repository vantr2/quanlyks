import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import KhachHangFinder from "../../../apis/KhachHangFinder";
import { NumberFormat, NormalizeDate } from "../../../utils/DataHandler";

const ChiTietKhachHang = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [khSelected, setKhSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await KhachHangFinder.get(`/danh-sach/${id}`);
        setKhSelected(res.data.data.khachhang);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setKhSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/khach-hang");
  };
  return (
    <div>
      <div>
        <div className="d-flex flex-row">
          <button className="btn btn-secondary mt-5" onClick={goBack}>
            Quay lại
          </button>
        </div>
        <h4 className="mt-3 mb-3">TÊN KHÁCH HÀNG: {khSelected.ten}</h4>

        <table className="table table-striped table-hover table-bordered mb-5">
          <tbody>
            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">
                Chứng minh nhân dân
              </td>
              <td className="col-9 pl-2">{NumberFormat(khSelected.cmnd)}</td>
            </tr>
            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">Số điện thoại</td>
              <td className="col-9 pl-2">{khSelected.sdt}</td>
            </tr>
            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">Giới tính</td>
              <td className="col-9 pl-2">
                {khSelected.gioitinh === 0
                  ? "Nam"
                  : khSelected.gioitinh === 1
                  ? "Nữ"
                  : "KXD"}
              </td>
            </tr>

            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">Ngày sinh</td>
              <td className="col-9 pl-2">
                {NormalizeDate(khSelected.ngaysinh)}
              </td>
            </tr>

            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">Địa chỉ</td>
              <td className="col-9 pl-2">{khSelected.diachi}</td>
            </tr>

            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">Tài khoản sử dụng</td>
              <td className="col-9 pl-2">{khSelected.account}</td>
            </tr>

            <tr className="d-flex">
              <td className="col-3 pl-2 font-weight-bold">Kiểu khách hàng</td>
              <td className="col-9 pl-2">{khSelected.kieukhachhang_name}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChiTietKhachHang;
