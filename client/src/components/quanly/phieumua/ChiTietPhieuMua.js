import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import { NumberFormat, NormalizeDate } from "../../../utils/DataHandler";
const ChiTietPhieuMua = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [phieumuaSelected, setPhieuMuaSelected] = useState([]);
  const { msgPhieuMuaActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhieuMuaFinder.get(`/danh-sach/${id}`);
        setPhieuMuaSelected(res.data.data.phieumua);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setPhieuMuaSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/ql-hang-hoa/phieu-mua");
  };
  const handleUpdate = () => {
    hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${id}/sua`);
  };
  return (
    <div>
      <div className="d-flex flex-row">
        <button className="btn btn-primary mt-5" onClick={goBack}>
          Quay lại
        </button>
        <div className="mt-5 ml-2">
          <button className="btn btn-warning px-4" onClick={handleUpdate}>
            Sửa
          </button>
        </div>
      </div>
      <p className="text-center text-success">{msgPhieuMuaActionSuccess}</p>
      <h4 className="mt-3 mb-3">MÃ PHIẾU : {phieumuaSelected.id}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Nhân viên tiếp nhận</td>
            <td className="col-9 pl-2">{phieumuaSelected.tennv}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày mua</td>
            <td className="col-9 pl-2">
              {NormalizeDate(phieumuaSelected.ngaymua)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tổng tiền</td>
            <td className="col-9 pl-2">
              {NumberFormat(phieumuaSelected.tongtien)}&nbsp;<b>VND</b>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ghi chú</td>
            <td className="col-9 pl-2">{phieumuaSelected.ghichu}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietPhieuMua;
