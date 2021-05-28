import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import ThuChiFinder from "../../../apis/ThuChiFinder";
import {
  NormalizeDate,
  convertTime,
  NumberFormat,
} from "../../../utils/DataHandler";
const PhieuThuChiTiet = () => {
  let hi = useHistory();
  const { id } = useParams();
  const [ptSelected, setPtSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await ThuChiFinder.get(`/phieu-thu/${id}`);
        setPtSelected(res.data.data.phieuthu);
      } catch (er) {
        console.log(er.message);
      }
    };
    fetchData();
  }, [id]);

  const goBack = () => {
    hi.push("/quan-ly/thu-chi/phieu-thu");
  };

  return (
    <div>
      <button className="btn btn-secondary" onClick={goBack}>
        Quay lại
      </button>
      <h4 className="mt-3">Mã phiếu : {ptSelected.id}</h4>
      <table className="table table-striped table-hover table-bordered mb-4">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Khoản thu</td>
            <td className="col-9 pl-2">{ptSelected.khoanthu}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Người thu</td>
            <td className="col-9 pl-2">{ptSelected.nvname}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Số điện thoại người thu
            </td>
            <td className="col-9 pl-2">{ptSelected.nvsdt}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              <strong>
                {ptSelected.trangthai === 0 ? "Chưa thu" : "Đã thu"}
              </strong>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày thu</td>
            <td className="col-9 pl-2">
              Ngày: {NormalizeDate(ptSelected.ngaythu)}, lúc{" "}
              {convertTime(ptSelected.ngaythu)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Đối tượng thu</td>
            <td className="col-9 pl-2">{ptSelected.khname}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Số điện thoại đối tượng thu
            </td>
            <td className="col-9 pl-2">{ptSelected.khsdt}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tổng tiền thu được</td>
            <td className="col-9 pl-2">
              <strong>{NumberFormat(ptSelected.tienthu)}</strong> VND
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PhieuThuChiTiet;
