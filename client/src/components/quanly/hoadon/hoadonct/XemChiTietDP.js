import React, { useState } from "react";
import DatPhongFinder from "../../../../apis/DatPhongFinder";
import {
  convertTime,
  NormalizeDate,
  NumberFormat,
} from "../../../../utils/DataHandler";

const XemChiTietDP = ({ id, phong }) => {
  const [datphongSelected, setDatPhongSelected] = useState([]);
  const handleClick = async () => {
    try {
      const res = await DatPhongFinder.get(`/danh-sach-full/${id}`);
      setDatPhongSelected(res.data.data.datphong);
    } catch (er) {
      console.log(er.message);
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-primary mr-2 "
        onClick={handleClick}
        data-toggle="modal"
        data-target={`#id${id}xemctdp`}
      >
        Xem chi tiết
      </button>

      <div className="modal fade mb-5" id={`id${id}xemctdp`}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header ">
              <h4 className="modal-title ">
                Thông tin chi tiết phiên đặt phòng <u>{phong}</u>
              </h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body"></div>
            <table className="table table-hover ">
              <tbody>
                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Hình thức đặt phòng
                  </td>
                  <td className="col-7 pl-2">{datphongSelected.hinhthucdp}</td>
                </tr>
                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Ngày đặt phòng
                  </td>
                  <td className="col-7 pl-2">
                    Ngày: {NormalizeDate(datphongSelected.ngaydat)}, lúc{" "}
                    {convertTime(datphongSelected.ngaydat)}
                  </td>
                </tr>
                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">Check In</td>
                  <td className="col-7 pl-2">
                    Ngày: {NormalizeDate(datphongSelected.checkin)}, lúc{" "}
                    {convertTime(datphongSelected.checkin)}
                  </td>
                </tr>
                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">Check Out</td>
                  <td className="col-7 pl-2">
                    Ngày: {NormalizeDate(datphongSelected.checkout)}, lúc{" "}
                    {convertTime(datphongSelected.checkout)}
                  </td>
                </tr>
                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Khách hàng Check In
                  </td>
                  <td className="col-7 pl-2">
                    {datphongSelected.kh_checkin
                      ? "Ngày:" +
                        NormalizeDate(datphongSelected.kh_checkin) +
                        ", lúc: " +
                        convertTime(datphongSelected.kh_checkin)
                      : "Khách hàng chưa check in"}
                  </td>
                </tr>
                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Khách hàng Check Out
                  </td>
                  <td className="col-7 pl-2">
                    {datphongSelected.kh_checkout
                      ? "Ngày:" +
                        NormalizeDate(datphongSelected.kh_checkout) +
                        ", lúc: " +
                        convertTime(datphongSelected.kh_checkin)
                      : "Khách hàng chưa check out"}
                  </td>
                </tr>

                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Hình thức thuê
                  </td>
                  <td className="col-7 pl-2">{datphongSelected.kieuthue}</td>
                </tr>

                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Giá thuê theo{" "}
                    {datphongSelected.kieuthue === "Thuê theo ngày"
                      ? "ngày"
                      : "giờ"}
                  </td>
                  <td className="col-7 pl-2">
                    {NumberFormat(datphongSelected.giathue)}&nbsp;<b>VND</b>
                  </td>
                </tr>

                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Số{" "}
                    {datphongSelected.kieuthue === "Thuê theo ngày"
                      ? "ngày"
                      : "giờ"}{" "}
                    thuê
                  </td>
                  <td className="col-7 pl-2">
                    {datphongSelected.sotgthue} &nbsp;
                    {datphongSelected.kieuthue === "Thuê theo ngày"
                      ? "ngày"
                      : "giờ"}
                  </td>
                </tr>

                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">Tiền cọc</td>
                  <td className="col-7 pl-2">
                    {NumberFormat(datphongSelected.tiencoc)}&nbsp;<b>VND</b>
                  </td>
                </tr>

                <tr className="d-flex mx-4">
                  <td className="col-5 pl-2 font-weight-bold">
                    Tổng tiền sử dụng dịch vụ
                  </td>
                  <td className="col-7 pl-2">
                    {NumberFormat(datphongSelected.tongtien)}&nbsp;<b>VND</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XemChiTietDP;
