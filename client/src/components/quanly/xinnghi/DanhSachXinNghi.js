import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import { useHistory } from "react-router";
import { NormalizeDate } from "../../../utils/DataHandler";
import XoaXinNghi from "./XoaXinNghi";
import NhanVienFinder from "../../../apis/NhanVienFinder";

const DanhSachXinNghi = () => {
  const { dsDon, setDsDon, msgDonActionSuccess } = useContext(AccountContext);
  const username = window.localStorage.getItem("user_name");
  const [nvid, setNvid] = useState("");
  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await XinNghiFinder.get(`/danh-sach-full/${nvid}`);
        if (res.data.status === "ok") {
          setDsDon(res.data.data.xinnghi);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();

    const getNhanVien = async () => {
      try {
        const res = await NhanVienFinder.get(
          `/danh-sach-nhan-vien-theo-acc/${username}`
        );
        setNvid(res.data.data.nhanvien.id);
      } catch (err) {
        console.log(err.message);
      }
    };
    getNhanVien();
  }, [setDsDon, nvid, username]);

  const handleDonSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/nhan-vien/xin-nghi/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/nhan-vien/xin-nghi/${id}/sua`);
  };

  const renderTrangThaiDon = (tt) => {
    let result;
    switch (tt + "") {
      case "0":
        result = (
          <u>
            <i className="fas fa-spinner text-info  ">&nbsp;Đang chờ</i>
          </u>
        );
        break;
      case "1":
        result = (
          <u>
            {" "}
            <i className="fas fa-check-circle text-success">&nbsp;Đồng ý</i>
          </u>
        );
        break;
      case "2":
        result = (
          <u>
            {" "}
            <i class="fas fa-ban text-danger">&nbsp;Từ chối</i>
          </u>
        );
        break;
      default:
        break;
    }
    return result;
  };

  const renderThoiGianNghi = (tg) => {
    let result;
    switch (tg + "") {
      case "0":
        result = "Nửa ngày";
        break;
      case "1":
        result = "Một ngày";
        break;
      case "2":
        result = "Một ngày rưỡi";
        break;
      case "3":
        result = "Hai ngày";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgDonActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Người duyệt</th>
              <th>Ngày nghỉ</th>
              <th>Thời gian nghỉ</th>
              <th>Trạng thái</th>
              <th>Xem</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsDon.map((don) => {
              return (
                <tr key={don.id} className="text-center">
                  <td className="align-middle">
                    {don.nguoiduyet ? don.nguoiduyet : "Chưa duyệt"}
                  </td>
                  <td className="text-center ">{NormalizeDate(don.khinao)}</td>
                  <td className="align-middle">
                    {renderThoiGianNghi(don.baolau)}
                  </td>
                  <td className="align-middle ">
                    {renderTrangThaiDon(don.trangthai)}
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleDonSelected(e, don.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className="fas fa-pencil-alt text-warning"
                      onClick={(e) => handleUpdate(e, don.id)}
                    >
                      &nbsp;Sửa
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {don.trangthai === 0 ? <XoaXinNghi id={don.id} /> : ""}
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

export default DanhSachXinNghi;
