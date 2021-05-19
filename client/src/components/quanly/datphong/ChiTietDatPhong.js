import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import {
  convertTime,
  NormalizeDate,
  NumberFormat,
} from "../../../utils/DataHandler";
import CTDPSuDungDichVu from "./CTDPSuDungDichVu";
const ChiTietDatPhong = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [dpSelected, setDPSelected] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DatPhongFinder.get(`/danh-sach-full/${id}`);
        setDPSelected(res.data.data.datphong);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setDPSelected, id]);
  const goBack = () => {
    hi.push("/quan-ly/phong/dat-phong");
  };
  const renderTrangThaiDP = (tt) => {
    let result;
    switch (tt + "") {
      case "0":
        result = "Đã thanh toán";
        break;
      case "1":
        result = "Đang hoạt động";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div>
      <div className="d-flex flex-row">
        <button className="btn btn-primary mt-5" onClick={goBack}>
          Quay lại
        </button>
        <div className="mt-5 ml-2">
          <CTDPSuDungDichVu id={id} />
        </div>
      </div>

      <h4 className="mt-3 mb-3">PHÒNG: {dpSelected.phong_id}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên khách hàng</td>
            <td className="col-9 pl-2">{dpSelected.kh_name}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số điện thoại</td>
            <td className="col-9 pl-2">{dpSelected.kh_sdt}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Chứng minh nhân dân</td>
            <td className="col-9 pl-2">{dpSelected.kh_cmnd}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              <u
                className={
                  dpSelected.trangthai === 0 ? "text-success" : "text-info"
                }
              >
                {renderTrangThaiDP(dpSelected.trangthai)}
              </u>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Hình thức đặt phòng</td>
            <td className="col-9 pl-2">{dpSelected.hinhthucdp}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày đặt phòng</td>
            <td className="col-9 pl-2">
              Ngày: {NormalizeDate(dpSelected.ngaydat)}, lúc{" "}
              {convertTime(dpSelected.ngaydat)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Check In</td>
            <td className="col-9 pl-2">
              Ngày: {NormalizeDate(dpSelected.checkin)}, lúc{" "}
              {convertTime(dpSelected.checkin)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Check Out</td>
            <td className="col-9 pl-2">
              Ngày: {NormalizeDate(dpSelected.checkout)}, lúc{" "}
              {convertTime(dpSelected.checkout)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Khách hàng Check In</td>
            <td className="col-9 pl-2">
              {dpSelected.kh_checkin
                ? "Ngày:" +
                  NormalizeDate(dpSelected.kh_checkin) +
                  ", lúc: " +
                  convertTime(dpSelected.kh_checkin)
                : "Khách hàng chưa check in"}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Khách hàng Check Out
            </td>
            <td className="col-9 pl-2">
              {dpSelected.kh_checkout
                ? "Ngày:" +
                  NormalizeDate(dpSelected.kh_checkout) +
                  ", lúc: " +
                  convertTime(dpSelected.kh_checkin)
                : "Khách hàng chưa check out"}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Hình thức thuê</td>
            <td className="col-9 pl-2">{dpSelected.kieuthue}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Giá thuê theo{" "}
              {dpSelected.kieuthue === "Thuê theo ngày" ? "ngày" : "giờ"}
            </td>
            <td className="col-9 pl-2">
              {NumberFormat(dpSelected.giathue)}&nbsp;<b>VND</b>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Số {dpSelected.kieuthue === "Thuê theo ngày" ? "ngày" : "giờ"}{" "}
              thuê
            </td>
            <td className="col-9 pl-2">
              {dpSelected.sotgthue} &nbsp;
              {dpSelected.kieuthue === "Thuê theo ngày" ? "ngày" : "giờ"}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tiền cọc</td>
            <td className="col-9 pl-2">
              {NumberFormat(dpSelected.tiencoc)}&nbsp;<b>VND</b>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Tổng tiền sử dụng dịch vụ
            </td>
            <td className="col-9 pl-2">
              {NumberFormat(dpSelected.tongtien)}&nbsp;<b>VND</b>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên người thực hiện</td>
            <td className="col-9 pl-2">{dpSelected.nv}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietDatPhong;
