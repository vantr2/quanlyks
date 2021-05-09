import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import { useHistory } from "react-router";
import { NormalizeDate, NumberFormat } from "../../../utils/DataHandler";
import XoaTaiSan from "./XoaTaiSan";

const DanhSachTaiSan = () => {
  const { dsTaiSan, setDsTaiSan, msgTaiSanActionSuccess } = useContext(
    AccountContext
  );

  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await TaiSanFinder.get("/danh-sach-tai-san");
        if (res.data.status === "ok") {
          setDsTaiSan(res.data.data.taisan);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsTaiSan]);

  const handleTaiSanSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/ql-tai-san/thong-tin/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/ql-tai-san/thong-tin/${id}/sua`);
  };

  const renderTrangThaiTaiSan = (tt) => {
    let result = "";
    switch (tt + "") {
      case "1":
        result = "Hoạt động tốt";
        break;
      case "0":
        result = "Bị hỏng";
        break;
      case "2":
        result = "Đang bảo dưỡng";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgTaiSanActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Tên tài sản</th>
              <th>Ngày mua</th>
              <th>Giá tài sản</th>
              <th>Trạng thái</th>
              <th>Vị trí</th>
              <th>Xem</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsTaiSan.map((taisan) => {
              return (
                <tr key={taisan.id}>
                  <td className="align-middle">{taisan.ten}</td>
                  <td className="text-center ">
                    {NormalizeDate(taisan.ngaymua)}
                  </td>
                  <td className="text-right align-middle">
                    {NumberFormat(taisan.giataisan)} <b>VND</b>
                  </td>
                  <td className="align-middle">
                    {renderTrangThaiTaiSan(taisan.trangthai)}
                  </td>
                  <td className="align-middle">{taisan.vitri}</td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleTaiSanSelected(e, taisan.id)}
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
                      onClick={(e) => handleUpdate(e, taisan.id)}
                    >
                      &nbsp;Sửa
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <XoaTaiSan id={taisan.id} />
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

export default DanhSachTaiSan;
