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
          borderBottom: "2px solid #515151 ",
        };
        break;
      case "QL":
        result = {
          background: "#f2f2ac",
          borderBottom: "2px solid #515151 ",
        };
        break;
      case "NVK":
        result = {
          background: "#f0c0a8",
          borderBottom: "2px solid #515151 ",
        };
        break;
      case "KH":
        result = {
          background: "#c0fab1",
          borderBottom: "2px solid #515151 ",
        };
        break;
      case "NVDP":
        result = {
          background: "#ffe3f0",
          borderBottom: "2px solid #515151 ",
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
      <table
        className="table table-hover "
        style={{ border: "2.4px solid black", color: "black" }}
      >
        <thead className="thead-dark text-center">
          <tr>
            <th style={{ borderRight: "0.5px solid white" }}>Tên người dùng</th>
            <th style={{ borderRight: "0.5px solid white" }}>Tên hiển thị</th>
            <th style={{ borderRight: "0.5px solid white" }}>Trạng thái</th>
            <th style={{ borderRight: "0.5px solid white" }}>Vai trò</th>
            <th style={{ borderRight: "0.5px solid white" }}>Sửa</th>
            {/* <th>Xóa</th> */}
            <th>Reset</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {nguoiDungList.map((nguoidung) => {
            return (
              <tr key={nguoidung.ten} style={customStyleLine(nguoidung.vaitro)}>
                <td style={{ borderRight: "0.5px solid #515151" }}>
                  {nguoidung.ten}
                </td>

                <td style={{ borderRight: "0.5px solid #515151" }}>
                  {nguoidung.ten_hienthi}
                </td>
                <td style={{ borderRight: "0.5px solid #515151" }}>
                  <ThayDoiTrangThaiTaiKhoan
                    ten={nguoidung.ten}
                    trangthai={nguoidung.trangthai}
                  />
                </td>
                <td style={{ borderRight: "0.5px solid #515151" }}>
                  {nguoidung.vaitro === "QL"
                    ? "Quản lý"
                    : nguoidung.vaitro === "KH"
                    ? "Khách hàng"
                    : nguoidung.vaitro === "NVLT"
                    ? "Nhân viên lễ tân"
                    : nguoidung.vaitro === "NVK"
                    ? "Nhân viên kho"
                    : nguoidung.vaitro === "NVDP"
                    ? "Nhân viên dọn phòng"
                    : ""}
                </td>
                <td
                  style={{
                    cursor: "pointer",
                    borderRight: "0.5px solid #515151",
                  }}
                >
                  {nguoidung.vaitro === "KH" ? (
                    ""
                  ) : (
                    <SuaThongTinNguoiDung nguoidung={nguoidung} />
                  )}
                </td>
                {/* <td>
                  <XoaNguoiDung ten={nguoidung.ten} tt={nguoidung.trangthai} />
                </td> */}
                <td
                  style={{
                    cursor: "pointer",
                    borderRight: "0.5px solid #515151",
                  }}
                >
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
