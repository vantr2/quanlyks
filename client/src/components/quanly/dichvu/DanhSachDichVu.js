import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DichVuFinder from "../../../apis/DichVuFinder";
import { useHistory } from "react-router";
import { NumberFormat } from "../../../utils/DataHandler";
import XoaDichVu from "./XoaDichVu";

const DanhSachDichVu = () => {
  const { dsDichVu, setDsDichVu, msgDichVuActionSuccess } =
    useContext(AccountContext);

  const [loaidichvu, setLoaiDichVu] = useState([]);
  let hi = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DichVuFinder.get("/danh-sach-dich-vu");
        if (res.data.status === "ok") {
          setDsDichVu(res.data.data.dichvu);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();

    const getLoaiDichVu = async () => {
      try {
        const res = await DichVuFinder.get("/danh-sach-loai-dich-vu");
        setLoaiDichVu(res.data.data.loaidv);
      } catch (err) {
        console.log(err.message);
      }
    };
    getLoaiDichVu();
  }, [setDsDichVu, setLoaiDichVu]);

  const handleDichVuSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/danh-muc/dich-vu/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/danh-muc/dich-vu/${id}/sua`);
  };

  const renderTenLoaiDichVu = (loaidv_id) => {
    let name = "";
    loaidichvu.forEach((item) => {
      if (item.id === loaidv_id) {
        name = item.name;
      }
    });
    return name;
  };
  return (
    <div>
      {" "}
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgDichVuActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Tên dịch vụ</th>
              <th>Ảnh</th>
              <th>Giá dịch vụ</th>
              <th>Loại dịch vụ</th>
              <th>Xem</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsDichVu.map((dichvu) => {
              return (
                <tr key={dichvu.id}>
                  <td className="align-middle">{dichvu.ten}</td>
                  <td className="text-center ">
                    <img src={dichvu.anhminhhoa} alt="Anh dichvu" width="100" />
                  </td>
                  <td className="text-right align-middle">
                    {NumberFormat(dichvu.giahientai)} <b>VND</b>
                  </td>
                  <td className="align-middle">
                    <u>{renderTenLoaiDichVu(dichvu.loaidichvu_id)}</u>
                  </td>
                  <td className="align-middle" style={{ cursor: "pointer" }}>
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleDichVuSelected(e, dichvu.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td className="align-middle" style={{ cursor: "pointer" }}>
                    <i
                      className="fas fa-pencil-alt text-warning"
                      onClick={(e) => handleUpdate(e, dichvu.id)}
                    >
                      &nbsp;Sửa
                    </i>
                  </td>
                  <td className="align-middle" style={{ cursor: "pointer" }}>
                    <XoaDichVu id={dichvu.id} />
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

export default DanhSachDichVu;
