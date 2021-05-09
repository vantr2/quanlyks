import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import XoaNhanVien from "./XoaNhanVien";
import { NormalizeDate, RenderGioiTinh } from "../../../utils/DataHandler";

const ChiTietNhanVien = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [nhanvienSelected, setNhanVienSelected] = useState([]);
  const { msgNhanVienActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NhanVienFinder.get(`/danh-sach-nhan-vien/${id}`);
        setNhanVienSelected(res.data.data.nhanvien);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setNhanVienSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/danh-muc/nhan-vien");
  };

  const renderVaiTro = (vt) => {
    let vaitro = "";
    switch (vt) {
      case "QL":
        vaitro = "Quản lý";
        break;
      case "NVLT":
        vaitro = "Nhân viên lễ tân";
        break;
      case "NVK":
        vaitro = "Nhân viên kho";
        break;
      case "NVDP":
        vaitro = "Nhân viên dọn phòng";
        break;
      default:
        break;
    }
    return vaitro;
  };

  const handleUpdate = () => {
    hi.push(`/quan-ly/danh-muc/nhan-vien/${id}/sua`);
  };

  return (
    <div>
      <h2 className="text-center">Chi tiết nhân viên</h2>
      <div className="d-flex flex-row">
        <button className="btn btn-primary mt-5" onClick={goBack}>
          Quay lại
        </button>
        <div className="mt-5 ml-2">
          <button className="btn btn-warning px-4" onClick={handleUpdate}>
            Sửa
          </button>
        </div>
        <div className="mt-5 ml-2">
          <XoaNhanVien />
        </div>
      </div>
      <p className="text-center text-success">{msgNhanVienActionSuccess}</p>
      <h4 className="mt-3 mb-3">{nhanvienSelected.name}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Tên nhân viên</td>
            <td className="col-8 pl-2">{nhanvienSelected.name}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Giới tính</td>
            <td className="col-8 pl-2">
              {RenderGioiTinh(nhanvienSelected.gioitinh)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Ngày sinh</td>
            <td className="col-8 pl-2">
              {NormalizeDate(nhanvienSelected.ngaysinh)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Địa chỉ</td>
            <td className="col-8 pl-2">{nhanvienSelected.diachi}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Chứng minh nhân dân</td>
            <td className="col-8 pl-2">{nhanvienSelected.cmnd}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Số điện thoại</td>
            <td className="col-8 pl-2">{nhanvienSelected.sdt}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Email</td>
            <td className="col-8 pl-2">{nhanvienSelected.email}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">
              Tài khoản đang sử dụng
            </td>
            <td className="col-8 pl-2">
              {nhanvienSelected.account === null
                ? "Tài khoản đã bị xóa"
                : nhanvienSelected.account}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-4 pl-2 font-weight-bold">Vai trò</td>
            <td className="col-8 pl-2">
              {renderVaiTro(nhanvienSelected.vaitro)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietNhanVien;
