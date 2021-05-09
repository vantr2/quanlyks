import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { NumberFormat, NormalizeDate } from "../../../utils/DataHandler";

const ChiTietBaoDuong = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [baoduongSelected, setBaoDuongSelected] = useState([]);
  const { msgBaoDuongActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await BaoDuongFinder.get(`/danh-sach/${id}`);
        setBaoDuongSelected(res.data.data.baoduong);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setBaoDuongSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/ql-tai-san/bao-duong");
  };
  const handleUpdate = () => {
    hi.push(`/quan-ly/ql-tai-san/bao-duong/${id}/sua`);
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
      <p className="text-center text-success">{msgBaoDuongActionSuccess}</p>
      <h4 className="mt-3 mb-3">{baoduongSelected.ten}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên người bảo dưỡng</td>
            <td className="col-9 pl-2">{baoduongSelected.nguoibd}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số điện thoại</td>
            <td className="col-9 pl-2">{baoduongSelected.sdt}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày bảo dưỡng</td>
            <td className="col-9 pl-2">
              {NormalizeDate(baoduongSelected.ngaybd)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tổng tiền</td>
            <td className="col-9 pl-2">
              {NumberFormat(baoduongSelected.tongtien)}&nbsp;<b>VND</b>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ghi chú</td>
            <td className="col-9 pl-2">{baoduongSelected.ghichu}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Nhân viên tiếp nhận</td>
            <td className="col-9 pl-2">{baoduongSelected.tennv}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietBaoDuong;
