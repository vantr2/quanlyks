import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import DatPhongOnlineFinder from "../../../apis/DatPhongOnlineFinder";
import { convertTime, NormalizeDate } from "../../../utils/DataHandler";
const DPOLChiTiet = () => {
  let hi = useHistory();
  const { id } = useParams();
  const [dpolSelected, setDPOLSelected] = useState([]);
  const [tt, setTT] = useState("0");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DatPhongOnlineFinder.get(`/danh-sach/${id}`);
        setDPOLSelected(res.data.data.dponline);
        setTT(res.data.data.dponline.trangthai + "");
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [id, setDPOLSelected, setTT]);

  const goBack = () => {
    hi.push("/quan-ly/phong/dat-phong-online");
  };

  const handleConfirm = async (tt) => {
    try {
      const res = await DatPhongOnlineFinder.put(`/confirm/${id}`, { tt: tt });
      if (res.data.status === "ok") {
        setTT(tt);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <div className="d-flex flex-row">
        <button className="btn btn-secondary mt-3" onClick={goBack}>
          Quay lại
        </button>

        {tt === "0" ? (
          <button
            type="button"
            className="btn btn-primary mt-3 ml-2"
            onClick={() => handleConfirm("1")}
          >
            Đã đáp ứng
          </button>
        ) : (
          ""
        )}

        {tt === "0" ? (
          <button
            type="button"
            className="btn btn-danger mt-3 ml-2"
            onClick={() => handleConfirm("2")}
          >
            Không thể đáp ứng
          </button>
        ) : (
          ""
        )}
      </div>
      {/* <p className="text-center text-success">{msgDichVuActionSuccess}</p> */}
      <h4 className="mt-3 mb-3">MÃ ĐƠN: {dpolSelected.id}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên khách hàng</td>
            <td className="col-9 pl-2">{dpolSelected.khname}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số điện thoại</td>
            <td className="col-9 pl-2">{dpolSelected.khsdt}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số tài khoản</td>
            <td className="col-9 pl-2">{dpolSelected.khstk}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Thời điểm nhận phòng
            </td>
            <td className="col-9 pl-2">
              {NormalizeDate(dpolSelected.checkin)}&nbsp;
              {convertTime(dpolSelected.checkin)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Thời điểm trả phòng</td>
            <td className="col-9 pl-2">
              {NormalizeDate(dpolSelected.checkout)}&nbsp;
              {convertTime(dpolSelected.checkout)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Thời điểm đặt phòng</td>
            <td className="col-9 pl-2">
              {NormalizeDate(dpolSelected.ngaydat)}&nbsp;
              {convertTime(dpolSelected.ngaydat)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              {" "}
              <i
                className={
                  tt === "0"
                    ? "far fa-circle text-info"
                    : tt === "1"
                    ? "far fa-check-circle text-success"
                    : "fas fa-ban text-danger"
                }
              >
                &nbsp;
                {tt === "0"
                  ? "Đang chờ"
                  : tt === "1"
                  ? "Đã đáp ứng"
                  : "Không thể đáp ứng"}
              </i>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số lượng phòng</td>
            <td className="col-9 pl-2">{dpolSelected.soluongphong}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số lượng người lớn</td>
            <td className="col-9 pl-2">{dpolSelected.nguoilon}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số lượng trẻ con</td>
            <td className="col-9 pl-2">{dpolSelected.trecon}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Loại phòng</td>
            <td className="col-9 pl-2">{dpolSelected.loaiphong}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DPOLChiTiet;
