import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import PhongFinder from "../../../apis/PhongFinder";
import { useHistory } from "react-router";
import { NumberFormat } from "../../../utils/DataHandler";
import XoaPhong from "./XoaPhong";
const DanhSachPhong = () => {
  const { dsPhong, setDsPhong, msgPhongActionSuccess } =
    useContext(AccountContext);
  let hi = useHistory();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await PhongFinder.get("/danh-sach-phong");
        if (res.data.status === "ok") {
          setDsPhong(res.data.data.phong);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getData();
  }, [setDsPhong]);

  const handlePhongSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/danh-muc/phong/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/danh-muc/phong/${id}/sua`);
  };
  return (
    <div className="mt-5">
      <p className="text-center text-success">{msgPhongActionSuccess}</p>
      <table className="table table-hover table-striped table-bordered ">
        <thead className="thead-dark text-center">
          <tr>
            <th>Tên phòng</th>
            <th>Ảnh</th>
            <th>Tiêu đề</th>
            <th>Giá phòng (/ngày)</th>
            <th>Giá phòng (/giờ)</th>
            <th>Xem</th>
            <th>Sửa</th>
            <th>Xóa</th>
          </tr>
        </thead>
        <tbody>
          {dsPhong.map((phong) => {
            return (
              <tr key={phong.ten}>
                <td className="align-middle">{phong.ten}</td>
                <td className="text-center ">
                  <img src={phong.anh} alt="Anh phong" width="100" />
                </td>
                <td className="align-middle">{phong.tieude}</td>
                <td className="text-right align-middle">
                  {NumberFormat(phong.giaphongtheongay)} <b>VND</b>
                </td>
                <td className="text-right align-middle">
                  {NumberFormat(phong.giaphongtheogio)} <b>VND</b>
                </td>
                <td className="align-middle" style={{ cursor: "pointer" }}>
                  {" "}
                  <i
                    className="far fa-eye text-primary"
                    onClick={(e) => handlePhongSelected(e, phong.ten)}
                  >
                    &nbsp;Xem
                  </i>
                </td>
                <td className="align-middle" style={{ cursor: "pointer" }}>
                  <i
                    className="fas fa-pencil-alt text-warning"
                    onClick={(e) => handleUpdate(e, phong.ten)}
                  >
                    &nbsp;Sửa
                  </i>
                </td>
                <td className="align-middle" style={{ cursor: "pointer" }}>
                  <XoaPhong ten={phong.ten} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DanhSachPhong;
