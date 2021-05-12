import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import { useHistory } from "react-router";
import { NormalizeDate, NumberFormat } from "../../../utils/DataHandler";
import XoaPhieuMua from "./XoaPhieuMua";

const DanhSachPhieuMua = () => {
  const { dsPhieuMua, setDsPhieuMua, msgPhieuMuaActionSuccess } =
    useContext(AccountContext);

  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhieuMuaFinder.get("/danh-sach");
        if (res.data.status === "ok") {
          setDsPhieuMua(res.data.data.phieumua);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsPhieuMua]);

  const handlePhieuMuaSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${id}/sua`);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgPhieuMuaActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Tên nhân viên</th>
              <th>Ngày mua</th>
              <th>Tổng tiền</th>
              <th>Ghi chú</th>
              <th>Xem</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsPhieuMua.map((phieumua) => {
              return (
                <tr key={phieumua.id}>
                  <td className="align-middle">{phieumua.tennv}</td>
                  <td className="text-center ">
                    {NormalizeDate(phieumua.ngaymua)}
                  </td>
                  <td className="text-right align-middle">
                    {NumberFormat(phieumua.tongtien)} <b>VND</b>
                  </td>
                  <td className="align-middle">{phieumua.ghichu}</td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handlePhieuMuaSelected(e, phieumua.id)}
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
                      onClick={(e) => handleUpdate(e, phieumua.id)}
                    >
                      &nbsp;Sửa
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <XoaPhieuMua id={phieumua.id} />
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

export default DanhSachPhieuMua;
