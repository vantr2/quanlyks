import React, { useEffect, useState } from "react";
import ThuChiFinder from "../../../apis/ThuChiFinder";
import { useHistory } from "react-router";
import { NumberFormat, NormalizeDate } from "../../../utils/DataHandler";
const PhieuThu = () => {
  let hi = useHistory();
  const [dsPhieuThu, setDsPhieuThu] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const r = await ThuChiFinder.get("/phieu-thu");
        setDsPhieuThu(r.data.data.phieuthu);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const handlePhieuThuSelected = (e, id) => {};

  return (
    <div className="mt-5">
      <table className="table table-hover table-striped table-bordered ">
        <thead className="thead-dark text-center">
          <tr>
            <th>Khoản thu</th>
            <th>Ngày thu</th>
            <th>Người thu</th>
            <th>Đối tượng</th>
            <th>Trạng thái</th>
            <th>Tổng tiền</th>
            <th>Xem</th>
            <th>Link</th>
          </tr>
        </thead>
        <tbody>
          {dsPhieuThu.map((phieuthu) => {
            return (
              <tr key={phieuthu.id}>
                <td className="align-middle text-center">
                  {phieuthu.khoanthu}
                </td>
                <td className="text-center ">
                  {NormalizeDate(phieuthu.ngaythu)}
                </td>
                <td className="align-middle">{phieuthu.nvname}</td>
                <td className="align-middle">{phieuthu.khname}</td>
                <td className="align-middle">
                  {phieuthu.trangthai === 0 ? (
                    <i className="fas fa-ban text-danger"> &nbsp;Chưa thu</i>
                  ) : (
                    <i className="far fa-check-circle text-success">
                      {" "}
                      &nbsp;Đã thu
                    </i>
                  )}{" "}
                </td>
                <td className="text-right align-middle">
                  {NumberFormat(phieuthu.tienthu)} <b>VND</b>
                </td>
                <td
                  className="align-middle text-center"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  <i
                    className="far fa-eye text-primary"
                    onClick={(e) => handlePhieuThuSelected(e, phieuthu.id)}
                  >
                    &nbsp;Xem
                  </i>
                </td>
                <td
                  className="align-middle text-center"
                  style={{ cursor: "pointer" }}
                >
                  {" "}
                  <i
                    className="fas fa-link"
                    onClick={() => {
                      hi.push(phieuthu.linkct);
                    }}
                  ></i>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PhieuThu;
