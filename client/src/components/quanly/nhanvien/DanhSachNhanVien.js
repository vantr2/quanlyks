import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { NormalizeDate, RenderGioiTinh } from "../../../utils/DataHandler";
import { useHistory } from "react-router";
import TimKiemNhanVien from "./TimKiemNhanVien";
import XoaNhanVienType2 from "./XoaNhanVienType2";

const DanhSachNhanVien = () => {
  let hi = useHistory();

  const { dsNhanVien, setDsNhanVien, msgNhanVienActionSuccess } = useContext(
    AccountContext
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien");
        // console.log(typeof res.data.data.nhanvien.account);
        setDsNhanVien(res.data.data.nhanvien);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setDsNhanVien]);

  const handleNhanVienSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/danh-muc/nhan-vien/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/danh-muc/nhan-vien/${id}/sua`);
  };

  return (
    <div className="list-group">
      <div className="mb-5">
        <TimKiemNhanVien />
      </div>
      <p className="text-center text-success">{msgNhanVienActionSuccess}</p>
      <table className="table table-hover table-striped table-bordered ">
        <thead className="thead-dark text-center">
          <tr>
            <th>Tên nhân viên</th>
            <th>Giới tính</th>
            <th>Ngày sinh</th>
            <th>SDT</th>
            <th>Tài khoản</th>
            <th>Xem</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {dsNhanVien.map((nhanvien) => {
            return (
              <tr key={nhanvien.id}>
                <td>{nhanvien.name}</td>
                <td>{RenderGioiTinh(nhanvien.gioitinh)}</td>
                <td>{NormalizeDate(nhanvien.ngaysinh)}</td>
                <td>{nhanvien.sdt}</td>
                <td>
                  {nhanvien.account === null ? "Đã bị xóa" : nhanvien.account}
                </td>
                <td style={{ cursor: "pointer" }}>
                  {nhanvien.account === null ? (
                    ""
                  ) : (
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleNhanVienSelected(e, nhanvien.id)}
                    >
                      &nbsp;Xem
                    </i>
                  )}
                </td>
                <td style={{ cursor: "pointer" }}>
                  {nhanvien.account === null ? (
                    ""
                  ) : (
                    <i
                      className="fas fa-pencil-alt text-warning"
                      onClick={(e) => handleUpdate(e, nhanvien.id)}
                    >
                      &nbsp;Sửa
                    </i>
                  )}
                </td>

                <td style={{ cursor: "pointer" }}>
                  <XoaNhanVienType2 id={nhanvien.id} />
                </td>
              </tr>
            );
          })}
          {/* <tr>
            <td>Trần Trọng Văn</td>
            <td>Nam</td>
            <td>14-12-1999</td>
            <td>031042342809</td>
            <td>0354457151</td>
            <td>trongvan</td>
            <td>Sửa</td>
            <td>Xóa</td>
          </tr> */}
        </tbody>
      </table>
    </div>
  );
};

export default DanhSachNhanVien;
