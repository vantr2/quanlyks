import React, { useEffect, useContext } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ResetPassword from "./ResetPassword";
import SuaThongTinNguoiDung from "./SuaThongTinNguoiDung";
import ThayDoiTrangThaiTaiKhoan from "./ThayDoiTrangThaiTaiKhoan";
// import XoaNguoiDung from "./XoaNguoiDung";

const DanhSachTaiKhoan = () => {
  const { nguoiDungList, setNguoiDungList, msgUserActionSuccess } =
    useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await TaiKhoanFinder.get("/danh-sach-nguoi-dung");
        setNguoiDungList(res.data.data.nguoidung);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setNguoiDungList]);

  const customStyleLine = (vt) => {
    let result;
    switch (vt + "") {
      case "NVLT":
        result = {
          background: "#c6f5d3",
        };
        break;
      case "QL":
        result = {
          background: "#f2f2ac",
        };
        break;
      case "NVK":
        result = {
          background: "#f0c0a8",
        };
        break;
      case "KH":
        result = {
          background: "#b5a6ed",
        };
        break;
      case "NVDP":
        result = {
          background: "#ed9de8",
        };
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div className="list-group">
      <p className="text-center text-success">
        <u>{msgUserActionSuccess}</u>
      </p>
      <table className="table table-hover table-bordered ">
        <thead className="thead-dark text-center">
          <tr>
            <th>Tên người dùng</th>
            <th>Mật khẩu</th>
            <th>Tên hiển thị</th>
            <th>Trạng thái</th>
            <th>Vai trò</th>
            <th>Sửa</th>
            {/* <th>Xóa</th> */}
            <th>Reset</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {nguoiDungList.map((nguoidung) => {
            return (
              <tr key={nguoidung.ten} style={customStyleLine(nguoidung.vaitro)}>
                <td>{nguoidung.ten}</td>
                <td>{nguoidung.mk}</td>
                <td>{nguoidung.ten_hienthi}</td>
                <td>
                  <ThayDoiTrangThaiTaiKhoan
                    ten={nguoidung.ten}
                    trangthai={nguoidung.trangthai}
                  />
                </td>
                <td>{nguoidung.vaitro}</td>
                <td>
                  <SuaThongTinNguoiDung nguoidung={nguoidung} />
                </td>
                {/* <td>
                  <XoaNguoiDung ten={nguoidung.ten} tt={nguoidung.trangthai} />
                </td> */}
                <td>
                  <ResetPassword ten={nguoidung.ten} />
                </td>
              </tr>
            );
          })}

          {/* <tr>
            <td>Admin</td>
            <td>van12312u10923103</td>
            <td>Trần Trọng Văn</td>
            <td>
              <i className="fas fa-dot-circle text-success"></i>
            </td>
            <td>KH</td>
            <td>
              <button className="btn btn-warning">Sửa</button>
            </td>
            <td>
              <button className="btn btn-danger">Xóa</button>
            </td>
          </tr>

          <tr>
            <td>Admin</td>
            <td>van12312u10923103</td>
            <td>Trần Trọng Văn</td>
            <td>
              <i class="far fa-dot-circle"></i>
            </td>
            <td>KH</td>
            <td>
              <button className="btn btn-warning">Sửa</button>
            </td>
            <td>
              <button className="btn btn-danger">Xóa</button>
            </td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default DanhSachTaiKhoan;
