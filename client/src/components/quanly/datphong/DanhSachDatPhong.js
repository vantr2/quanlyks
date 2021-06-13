import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import {
  convertTime,
  NormalizeDate,
  NumberFormat,
} from "../../../utils/DataHandler";
import { useHistory } from "react-router";
import TimKiemPhieuThue from "./TimKiemPhieuThue";
import PrintWindow from "../../../utils/PrintWindow";
const DanhSachDatPhong = () => {
  const { msgDatPhongActionSuccess, dsDatPhong, setDsDatPhong } =
    useContext(AccountContext);
  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DatPhongFinder.get("/danh-sach-full");
        setDsDatPhong(res.data.data.datphong);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsDatPhong]);

  const handleDPSelected = async (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/phong/dat-phong/${id}`);
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
      case "2":
        result = "Đã bị hủy";
        break;
      default:
        break;
    }
    return result;
  };

  const renderTrangThaiPhong = (tt) => {
    let trangthai = "";
    switch (tt + "") {
      case "0":
        trangthai = "Sẵn sàng";
        break;
      case "1":
        trangthai = "Đang được đặt";
        break;
      case "2":
        trangthai = "Đang sử dụng";
        break;
      case "3":
        trangthai = "Đã trả phòng.";
        break;
      case "4":
        trangthai = "Chưa thanh toán.";
        break;
      case "5":
        trangthai = "Chưa dọn.";
        break;
      default:
        break;
    }
    return trangthai;
  };

  const ttphongStyle = (tt) => {
    let sty;
    switch (tt + "") {
      case "0":
        sty = {
          height: "16px",
          border: "2px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#2640eb",
        };
        break;
      case "1":
        sty = {
          height: "16px",
          border: "2px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#24e3dd",
        };
        break;
      case "2":
        sty = {
          height: "16px",
          border: "2px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#2fed39",
        };
        break;
      case "3":
        sty = {
          height: "16px",
          border: "2px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#b3e33b",
        };
        break;
      case "4":
        sty = {
          height: "16px",
          border: "2px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#f5c536",
        };
        break;
      case "5":
        sty = {
          height: "16px",
          border: "2px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#f09e41",
        };
        break;
      default:
        break;
    }
    return sty;
  };

  const handlePrintPT = async (e, datphong) => {
    // PrintWindow();
    // console.log(datphong);
    const title = "PHIẾU THUÊ PHÒNG";
    const benA = `
    <p><b>Khách Hàng:</b> ${datphong.kh_name}
                  <p style="margin-top:-15px"><b>CMND:</b> ${datphong.kh_cmnd}</p>
                  <p style="margin-top:-15px"><b>SĐT:</b> ${datphong.kh_sdt}</p>
                  <p style="margin-top:-15px"><b>Nhân viên:</b> ${datphong.nv}</p>
    `;
    const checkin =
      NormalizeDate(datphong.checkin) + " " + convertTime(datphong.checkin);
    const checkout =
      NormalizeDate(datphong.checkout) + " " + convertTime(datphong.checkout);
    const benB = `
    <p><b>Phòng thuê:</b>: ${datphong.phong_id}
                <p style="margin-top:-15px"><b>Ngày nhận phòng: </b> ${checkin}</p> 
                <p style="margin-top:-15px"><b>Ngày trả phòng:</b> ${checkout}</p>
                <p style="margin-top:-15px"><b>Kiểu thuê phòng:</b> ${datphong.kieuthue}</p>
    `;

    const info = `
    <div class="row mt-5"> 
                <div class="col-4">
                    ${benA}
                </p>
                 </div>
              <div class="col-1"></div>
               <div class="col-7">
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

    const dvt = datphong.kieuthue === "Thuê theo ngày" ? "ngày" : "giờ";
    const giathue = NumberFormat(datphong.giathue);
    const thanhtien = NumberFormat(
      parseInt(datphong.sotgthue) * parseInt(datphong.giathue) + ""
    );
    let tbody = `
    <tr style="border-bottom:2px solid #212121">
    <td class="text-center font-weight-bold" style="border-right:2px solid #212121">1</td>
    <td class="text-center" style="border-right:2px solid #212121">Tiền phòng</td>
    <td class="text-center" style="border-right:2px solid #212121">${giathue}</td>
    <td class="text-center" style="border-right:2px solid #212121">${datphong.sotgthue}</td>
    <td class="text-center" style="border-right:2px solid #212121">${dvt}</td>
    <td class="text-center" style="border-right:2px solid #212121">${thanhtien}</td>
  </tr>
    `;

    const res = await DatPhongFinder.get(
      `/danh-sach-dich-vu-so-luong/${datphong.id}`
    );
    const dv = res.data.data.datphong_chitiet;
    dv.forEach((item, index) => {
      const giadv = NumberFormat(item.gia);
      const ttdv = NumberFormat(
        parseInt(item.gia) * parseInt(item.soluong) + ""
      );
      tbody += `
        <tr style="border-bottom:2px solid #212121">
        <td class="text-center font-weight-bold" style="border-right:2px solid #212121">${
          index + 2
        }</td>
        <td class="text-center" style="border-right:2px solid #212121">${
          item.dv_name
        }</td>
        <td class="text-center" style="border-right:2px solid #212121">${giadv}</td>
        <td class="text-center" style="border-right:2px solid #212121">${
          item.soluong
        }</td>
        <td class="text-center" style="border-right:2px solid #212121">lần</td>
        <td class="text-center" style="border-right:2px solid #212121">${ttdv}</td>
      </tr>
        `;
    });

    const tongcong = NumberFormat(
      parseInt(datphong.tongtien) +
        parseInt(datphong.giathue) * parseInt(datphong.sotgthue) +
        ""
    );
    tbody += `  <tr style="border-bottom:2px solid #212121">
    <td class="text-center" style="border-right:2px solid #212121" colspan="5">Tổng cộng:</td>
    <td class="text-center" style="border-right:2px solid #212121">${tongcong}</td>
  </tr>
    `;

    PrintWindow(title, info, benAdd, benBdd, thead, tbody);
  };

  return (
    <div>
      <div className="mt-5 mb-5">
        <TimKiemPhieuThue />
        <p className="text-center text-success">{msgDatPhongActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Mã phiếu</th>
              <th>Phòng</th>
              <th>Khách hàng</th>
              <th>SDT</th>
              <th>Trạng thái DP</th>
              <th>Trạng thái phòng</th>
              <th>Ngày đặt</th>
              <th>Xem</th>
              <th>In</th>
            </tr>
          </thead>
          <tbody>
            {dsDatPhong.map((datphong) => {
              return (
                <tr key={datphong.id}>
                  <td className="align-middle text-center">{datphong.id}</td>
                  <td className="align-middle">{datphong.phong_id}</td>
                  <td className="align-middle">{datphong.kh_name}</td>
                  <td className="align-middle">{datphong.kh_sdt}</td>
                  <td
                    className={`align-middle ${
                      datphong.trangthai === 0
                        ? "text-success"
                        : datphong.trangthai === 2
                        ? "text-danger"
                        : "text-info"
                    }`}
                  >
                    <u>{renderTrangThaiDP(datphong.trangthai)}</u>
                  </td>
                  <td className="align-middle">
                    <button
                      type="button"
                      style={
                        datphong.trangthai === 0
                          ? {
                              height: "16px",
                              border: "1px solid black",
                              borderRadius: "8px",
                              marginRight: "0.5rem",
                              background: "green",
                            }
                          : datphong.trangthai === 2
                          ? {
                              height: "16px",
                              border: "1px solid black",
                              borderRadius: "8px",
                              marginRight: "0.5rem",
                              background: "red",
                            }
                          : ttphongStyle(datphong.tt_phong)
                      }
                    ></button>
                    {datphong.trangthai === 0
                      ? "Đã thanh toán"
                      : datphong.trangthai === 2
                      ? "Đã bị hủy"
                      : renderTrangThaiPhong(datphong.tt_phong)}
                  </td>
                  <td className="text-right align-middle">
                    {NormalizeDate(datphong.ngaydat)}{" "}
                    {convertTime(datphong.ngaydat)}
                  </td>

                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    {datphong.trangthai !== 2 ? (
                      <i
                        className="far fa-eye text-primary"
                        onClick={(e) => handleDPSelected(e, datphong.id)}
                      >
                        &nbsp;Xem
                      </i>
                    ) : (
                      ""
                    )}
                  </td>

                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    {datphong.trangthai !== 2 ? (
                      <i
                        className="fas fa-print text-info"
                        onClick={(e) => handlePrintPT(e, datphong)}
                      >
                        &nbsp;In
                      </i>
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
    </div>
  );
};

export default DanhSachDatPhong;
