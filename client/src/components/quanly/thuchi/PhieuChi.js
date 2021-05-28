import React, { useContext, useEffect, useState } from "react";
import ThuChiFinder from "../../../apis/ThuChiFinder";
import { useHistory } from "react-router";
import { NumberFormat, NormalizeDate } from "../../../utils/DataHandler";
import { AccountContext } from "../../../contexts/AccountContext";
import XoaPhieuChi from "./XoaPhieuChi";
const PhieuChi = () => {
  let hi = useHistory();
  const [dsPhieuChi, setDsPhieuChi] = useState([]);
  const { msgPhieuChiActionSuccess } = useContext(AccountContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await ThuChiFinder.get("/phieu-chi");
        setDsPhieuChi(r.data.data.phieuchi);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const handlePhieuChiUpdate = (e, pc) => {
    e.stopPropagation();
    hi.push(`/quan-ly/thu-chi/phieu-chi/${pc.id}/súa`);
  };
  return (
    <div className="mt-5">
      <p className="text-success">{msgPhieuChiActionSuccess}</p>
      <table className="table table-hover table-striped table-bordered ">
        <thead className="thead-dark text-center">
          <tr>
            <th>Mã phiếu</th>
            <th>Khoản chi</th>
            <th>Ngày chi</th>
            <th>Người chi</th>
            <th>Số điện thoại</th>
            <th>Tiền chi</th>
            <th>Sửa</th>
            <th>Xóa</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {dsPhieuChi.map((phieuchi) => {
            return (
              <tr key={phieuchi.id}>
                <td className="align-middle text-center">{phieuchi.id}</td>
                <td className="align-middle text-center">
                  {phieuchi.khoanchi}
                </td>
                <td className="text-center ">
                  {NormalizeDate(phieuchi.ngaychi)}
                </td>
                <td className="align-middle">{phieuchi.nvname}</td>
                <td className="align-middle">{phieuchi.nvsdt}</td>

                <td className="text-right align-middle">
                  {NumberFormat(phieuchi.tienchi)} <b>VND</b>
                </td>

                <td
                  className="align-middle text-center"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  {phieuchi.thamchieu ? (
                    ""
                  ) : (
                    <i
                      className="fas fa-pencil-alt text-warning"
                      onClick={(e) => handlePhieuChiUpdate(e, phieuchi)}
                    >
                      &nbsp;Sửa
                    </i>
                  )}
                </td>
                <td style={{ cursor: "pointer" }}>
                  <XoaPhieuChi pc={phieuchi} />
                </td>
                <td
                  className="align-middle text-center"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  {phieuchi.thamchieu ? (
                    <i
                      className="fas fa-link text-secondary"
                      onClick={() => {
                        hi.push(phieuchi.linkct);
                      }}
                    ></i>
                  ) : (
                    ""
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PhieuChi;
