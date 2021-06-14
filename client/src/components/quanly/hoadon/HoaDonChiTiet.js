import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import {
  NormalizeDate,
  convertTime,
  NumberFormat,
} from "../../../utils/DataHandler";
import PrintWindow from "../../../utils/PrintWindow";
import ThanhToan from "./hoadonct/ThanhToan";
import XemChiTietDP from "./hoadonct/XemChiTietDP";
import XemDichVuDaSuDung from "./hoadonct/XemDichVuDaSuDung";

const HoaDonChiTiet = () => {
  let hi = useHistory();

  const { id } = useParams();
  const [hoadonSelected, setHoaDonSelected] = useState([]);
  const [dsDPTheoHoaDon, setDPTheoHoaDon] = useState([]);
  const [showDSPhong, setShowDsPhong] = useState(false);

  const [hoadonct, setHoaDonCt] = useState([]);

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

    const getHoaDonCT = async () => {
      try {
        const res = await HoaDonFinder.get(`/danh-sach-theo-hoa-don-2/${id}`);

        res.data.data.hoadon_chitiet.forEach(async (item) => {
          item.dichvu = [];
          const res_dv = await DatPhongFinder.get(
            `danh-sach-dich-vu-so-luong/${item.datphong_id}`
          );
          item.dichvu = res_dv.data.data.datphong_chitiet;
          setHoaDonCt((hoadonct) => [item, ...hoadonct]);
        });
      } catch (er) {
        console.log(er.message);
      }
    };

    getHoaDonCT();
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

  let tbody = ``;
  let stt = 1;

  const handlePrint = async (hd) => {
    console.log(hd);
    const title = "HÓA ĐƠN";

    const benA = `
    <p><b>Khách Hàng:</b> ${hd.kh_name}
                  <p style="margin-top:-15px"><b>CMND:</b> ${hd.kh_cmnd}</p>
                  <p style="margin-top:-15px"><b>SĐT:</b> ${hd.kh_sdt}</p>
    `;

    const ngaylap = NormalizeDate(hd.ngaylap) + " " + convertTime(hd.ngaylap);
    const benB = `
    <p><b>Nhân viên:</b> ${hd.nv_name}
                  <p style="margin-top:-15px"><b>SĐT:</b> ${hd.kh_sdt}</p>
                  <p style="margin-top:-15px"><b>Ngày lập:</b> ${ngaylap}</p>
    `;

    const info = `
    <div class="row mt-5"> 
                <div class="col-5">
                    ${benA}
                </p>
                 </div>
              <div class="col-1"></div>
               <div class="col-6">
                 ${benB}
                </div>
            </div>`;
    const benAdd = "Khách sạn";
    const benBdd = "Khách hàng";

    const thead = `
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">STT</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Tên</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Giá</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Số lượng</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Đơn vị</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Thành tiền</td>
    `;

    console.log(hoadonct);
    hoadonct.forEach((ct) => {
      const dvt = ct.kieuthue === "Thuê theo ngày" ? "ngày" : "giờ";
      const giathue = NumberFormat(ct.giathue);
      const thanhtien = NumberFormat(
        parseInt(ct.sotgthue) * parseInt(ct.giathue) + ""
      );

      tbody += `  
        <tr style="border-bottom:2px solid #212121">
            <td class="text-left" style="border-right:2px solid #212121" colspan="6">Phòng ${ct.phong_id}</td>
        </tr>

        <tr style="border-bottom:2px solid #212121">
            <td class="text-center font-weight-bold" style="border-right:2px solid #212121">${stt}</td>
            <td class="text-center" style="border-right:2px solid #212121">Tiền phòng</td>
            <td class="text-center" style="border-right:2px solid #212121">${giathue}</td>
            <td class="text-center" style="border-right:2px solid #212121">${ct.sotgthue}</td>
            <td class="text-center" style="border-right:2px solid #212121">${dvt}</td>
            <td class="text-right" style="border-right:2px solid #212121">${thanhtien}</td>
        </tr>
        `;

      stt++;
      console.log(ct.dichvu);
      ct.dichvu.forEach((dv) => {
        console.log(dv);
        const giadv = NumberFormat(dv.gia);
        const ttdv = NumberFormat(parseInt(dv.gia) * parseInt(dv.soluong) + "");
        tbody += `
          <tr style="border-bottom:2px solid #212121">
              <td class="text-center font-weight-bold" style="border-right:2px solid #212121">${stt}</td>
              <td class="text-center" style="border-right:2px solid #212121">${dv.dv_name}</td>
              <td class="text-center" style="border-right:2px solid #212121">${giadv}</td>
              <td class="text-center" style="border-right:2px solid #212121">${dv.soluong}</td>
              <td class="text-center" style="border-right:2px solid #212121">lần</td>
              <td class="text-right" style="border-right:2px solid #212121">${ttdv}</td>
          </tr>
          `;
        stt++;
      });
    });

    const tongcong = NumberFormat(hd.thanhtien);
    tbody += `  
        <tr style="border-bottom:2px solid #212121">
            <td class="text-center" style="border-right:2px solid #212121" colspan="5">Tổng cộng :</td>
            <td class="text-right" style="border-right:2px solid #212121">${tongcong}</td>
        </tr>
      `;

    const vat = NumberFormat(parseInt(hd.thanhtien) * (hd.vat / 100));

    tbody += `  
        <tr style="border-bottom:2px solid #212121">
            <td class="text-center" style="border-right:2px solid #212121" colspan="5">Thuế GTGT ( ${hd.vat}% ):</td>
            <td class="text-right" style="border-right:2px solid #212121">${vat}</td>
        </tr>
        `;
    const tongcoc = NumberFormat(hd.tongcoc);
    tbody += `  
        <tr style="border-bottom:2px solid #212121">
            <td class="text-center" style="border-right:2px solid #212121" colspan="5">Tổng tiền cọc của khách hàng:</td>
            <td class="text-right" style="border-right:2px solid #212121">${tongcoc}</td>
        </tr>
        `;
    const chietkhautong = NumberFormat(hd.chietkhautong);
    tbody += `  
            <tr style="border-bottom:2px solid #212121">
                <td class="text-center" style="border-right:2px solid #212121" colspan="5">Chiết khấu tổng:</td>
                <td class="text-right" style="border-right:2px solid #212121">${chietkhautong}</td>
            </tr>
            `;
    const tientt = NumberFormat(hd.tongtien);
    tbody += `  
        <tr style="border-bottom:2px solid #212121">
            <td class="text-center" style="border-right:2px solid #212121" colspan="5">Tổng tiền khách hàng thanh toán:</td>
            <td class="text-right" style="border-right:2px solid #212121">${tientt}</td>
        </tr>
        `;
    PrintWindow(title, info, benAdd, benBdd, thead, tbody);
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
                      Tiền phạt : <strong>{NumberFormat(hdct.tienphat)}</strong>{" "}
                      VND
                    </li>
                    <li className="list-group-item">
                      Tiền cọc &nbsp;&nbsp;:{" "}
                      <strong>{NumberFormat(hdct.tiencoc)}</strong> VND
                    </li>
                    <li className="list-group-item">
                      Tổng tiền : <strong>{NumberFormat(hdct.tongtien)}</strong>{" "}
                      VND
                      <div>
                        <em> (bao gồm tiền phòng và tiền sử dụng dịch vụ)</em>
                      </div>
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
        {hoadonSelected.trangthai === 0 ? (
          <ThanhToan id={id} dsdp={dsDPTheoHoaDon} />
        ) : (
          ""
        )}
        <button
          type="button"
          className="btn btn-info ml-2 px-5"
          onClick={() => handlePrint(hoadonSelected)}
        >
          In
        </button>
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
              Ngày: {NormalizeDate(hoadonSelected.ngaylap)}, lúc{" "}
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
            <td className="col-3 pl-2 font-weight-bold">Chiêt khấu tổng</td>
            <td className="col-9 pl-2">
              <strong>{NumberFormat(hoadonSelected.chietkhautong)}</strong> VND
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
          </tr>
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
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default HoaDonChiTiet;
