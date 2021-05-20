import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import {
  convertDate,
  convertTime,
  NumberFormat,
} from "../../../utils/DataHandler";
import ThanhToan from "./hoadonct/ThanhToan";
import XemChiTietDP from "./hoadonct/XemChiTietDP";
import XemDichVuDaSuDung from "./hoadonct/XemDichVuDaSuDung";

const HoaDonChiTiet = () => {
  let hi = useHistory();
  const { id } = useParams();
  const [hoadonSelected, setHoaDonSelected] = useState([]);
  const [dsDPTheoHoaDon, setDPTheoHoaDon] = useState([]);
  const [showDSPhong, setShowDsPhong] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res_hd = await HoaDonFinder.get(`/danh-sach/${id}`);
        setHoaDonSelected(res_hd.data.data.hoadon);

        const res_dp = await HoaDonFinder.get(`/danh-sach-theo-hoa-don/${id}`);
        setDPTheoHoaDon(res_dp.data.data.hoadon_chitiet);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setHoaDonSelected, id, setDPTheoHoaDon]);

  const goBack = () => {
    hi.push("/quan-ly/phong/hoa-don");
  };

  const renderTrangThaiHoaDon = (tt) => {
    let result = "";
    switch (tt + "") {
      case "1":
        result = "Đã thanh toán";
        break;
      case "0":
        result = "Chưa thanh toán";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div className="mt-5">
      <div className={showDSPhong ? "row" : "row d-none"}>
        {dsDPTheoHoaDon.map((hdct) => {
          return (
            <div className="col-4" key={hdct.id}>
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="text-center">PHÒNG: {hdct.phong}</h5>
                </div>
                <div className="card-body ">
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                      Tiền phạt : <strong>{hdct.tienphat}</strong> VND
                    </li>
                    <li className="list-group-item">
                      Tiền cọc &nbsp;&nbsp;: <strong>{hdct.tiencoc}</strong> VND
                    </li>
                    <li className="list-group-item">
                      Tổng tiền : <strong>{hdct.tongtien}</strong> VND
                    </li>
                  </ul>
                </div>
                <div className="card-footer d-flex flex-row justify-content-center">
                  <XemChiTietDP id={hdct.datphong_id} phong={hdct.phong} />
                  <XemDichVuDaSuDung id={hdct.datphong_id} phong={hdct.phong} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex flex-row">
        <button className="btn btn-secondary" onClick={goBack}>
          Quay lại
        </button>
        <button
          type="button"
          className={
            showDSPhong ? "btn btn-mute ml-2 px-5" : "btn btn-primary ml-2"
          }
          onClick={(e) => setShowDsPhong(!showDSPhong)}
        >
          {showDSPhong ? "Đóng" : "Danh sách phòng"}
        </button>
        <ThanhToan id={id} dsdp={dsDPTheoHoaDon} />
      </div>

      <h4 className="mt-3">Thông tin hóa đơn</h4>
      <table className="table table-striped table-hover table-bordered mb-4">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Khách hàng</td>
            <td className="col-9 pl-2">{hoadonSelected.kh_name}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              <strong>{renderTrangThaiHoaDon(hoadonSelected.trangthai)}</strong>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày lập hóa đơn</td>
            <td className="col-9 pl-2">
              Ngày: {convertDate(hoadonSelected.ngaylap)}, lúc{" "}
              {convertTime(hoadonSelected.ngaylap)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Người lập</td>
            <td className="col-9 pl-2">{hoadonSelected.nv_name}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Hình thức thanh toán
            </td>
            <td className="col-9 pl-2">
              {hoadonSelected.hinhthuctt === 1 ? "Tiền mặt" : "Chuyển khoản"}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Tổng tiền phòng và SDDV
            </td>
            <td className="col-9 pl-2">
              <strong>{NumberFormat(hoadonSelected.thanhtien)}</strong> VND
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Tổng tiền cọc của khách
            </td>
            <td className="col-9 pl-2">
              <strong>{NumberFormat(hoadonSelected.tongcoc)}</strong> VND
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tổng tiền phạt</td>
            <td className="col-9 pl-2">
              <strong>{NumberFormat(hoadonSelected.tongphat)}</strong> VND
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tiền thuế GTGT</td>
            <td className="col-9 pl-2">
              <strong>
                {NumberFormat(
                  (parseInt(hoadonSelected.vat) *
                    parseInt(hoadonSelected.thanhtien)) /
                    100
                )}
              </strong>{" "}
              VND
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Tổng tiền phải thanh toán
            </td>
            <td className="col-9 pl-2">
              <strong>{NumberFormat(hoadonSelected.tongtien)}</strong> VND
            </td>
          </tr>
        </tbody>
      </table>

      <h4>Thông tin khách hàng</h4>
      <table className="table table-striped table-hover table-bordered mb-4">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên khách hàng</td>
            <td className="col-9 pl-2">{hoadonSelected.kh_name}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số điện thoại</td>
            <td className="col-9 pl-2">
              {NumberFormat(hoadonSelected.kh_sdt)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Chứng minh nhân dân</td>
            <td className="col-9 pl-2">
              {NumberFormat(hoadonSelected.kh_cmnd)}
            </td>
          </tr>{" "}
        </tbody>
      </table>

      <h4>Thông tin nhân viên lập phiếu</h4>
      <table className="table table-striped table-hover table-bordered mb-4">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên nhân viên</td>
            <td className="col-9 pl-2">{hoadonSelected.nv_name}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Số điện thoại</td>
            <td className="col-9 pl-2">
              {NumberFormat(hoadonSelected.nv_sdt)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Tài khoản đang sử dụng
            </td>
            <td className="col-9 pl-2">{hoadonSelected.nv_account}</td>
          </tr>{" "}
        </tbody>
      </table>
    </div>
  );
};

export default HoaDonChiTiet;
