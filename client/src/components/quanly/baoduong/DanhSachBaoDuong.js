import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { useHistory } from "react-router";
import { NormalizeDate, NumberFormat } from "../../../utils/DataHandler";
import XoaBaoDuong from "./XoaBaoDuong";
import PrintWindow from "../../../utils/PrintWindow";
const DanhSachBaoDuong = () => {
  const { dsBaoDuong, setDsBaoDuong, msgBaoDuongActionSuccess } =
    useContext(AccountContext);

  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await BaoDuongFinder.get("/danh-sach");
        if (res.data.status === "ok") {
          setDsBaoDuong(res.data.data.baoduong);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsBaoDuong]);

  const handleBaoDuongSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/ql-tai-san/bao-duong/${id}`);
  };

  const handleUpdate = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/ql-tai-san/bao-duong/${id}/sua`);
  };

  const handlePrint = async (e, bd) => {
    console.log(bd);

    const title = "PHIẾU BẢO DƯỠNG";
    const benA = `
    <p><b>Người bảo dưỡng:</b> ${bd.nguoibd}
    <p style="margin-top:-15px"><b>SDT:</b> ${bd.sdt}</p>
      `;

    const ngaybd = NormalizeDate(bd.ngaybd);
    const benB = `
    <p><b>Ngày lập:</b> ${ngaybd}
    <p style="margin-top:-15px"><b>Nhân viên:</b> ${bd.tennv}</p>
    `;

    const info = `
    <div class="row mt-5"> 
    
                <div class="col-5">
                    ${benA}
                </p>
                 </div>
                 <div class="col-1"></div>
               <div class="col-5">
                 ${benB}
                </div>
                <div class="col-1"></div>
            </div>`;
    const benAdd = `Người bảo dưỡng`;
    const benBdd = `Khách sạn`;

    const thead = `
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">STT</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Phòng</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Tài sản</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Phí bảo dưỡng</td>
    <td class="text-center font-weight-bold" style="border-right:2px solid #191919">Ghi chú</td>
    `;

    let bdct = [];
    try {
      const res = await BaoDuongFinder.get(`/danh-sach-chi-tiet/${bd.id}`);
      if (res.data.status === "ok") {
        bdct = res.data.data.baoduong_chitiet;
      }
    } catch (err) {
      console.log(err.message);
    }

    let tbody = ``;

    bdct.forEach((item, index) => {
      const phibd = NumberFormat(item.phibd);
      tbody += ` <tr style="border-bottom:2px solid #212121">
    <td class="text-center font-weight-bold" style="border-right:2px solid #212121">${
      index + 1
    }</td>
    <td class="text-center" style="border-right:2px solid #212121">${
      item.vitri
    }</td>
    <td class="text-center" style="border-right:2px solid #212121">${
      item.ten
    }</td>
    <td class="text-center" style="border-right:2px solid #212121">${phibd}</td>
    <td class="text-center" style="border-right:2px solid #212121">${
      item.ghichu
    }</td>
  </tr>`;
    });

    const tongcong = NumberFormat(bd.tongtien);
    tbody += `  <tr style="border-bottome:2px solid #212121">
    <td class="text-center" style="border-right:2px solid #212121" colspan="3">Tổng cộng:</td>
    <td class="text-center" style="border-right:2px solid #212121">${tongcong}</td>
    <td></td>
  </tr>
    `;
    // console.log(bdct);
    PrintWindow(title, info, benAdd, benBdd, thead, tbody);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgBaoDuongActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Người bảo dưỡng</th>
              <th>Số điện thoại</th>
              <th>Ngày bảo dưỡng</th>
              <th>Tổng tiền</th>
              <th>NV Tiếp nhận</th>
              <th>Xem</th>
              <th>Sửa</th>
              <th>Xóa</th>
              <th>In</th>
            </tr>
          </thead>
          <tbody>
            {dsBaoDuong.map((baoduong) => {
              return (
                <tr key={baoduong.id}>
                  <td className="text-center">{baoduong.nguoibd}</td>
                  <td className="text-center">{baoduong.sdt}</td>
                  <td className="text-center ">
                    {NormalizeDate(baoduong.ngaybd)}
                  </td>
                  <td className="text-right align-middle">
                    {NumberFormat(baoduong.tongtien)} <b>VND</b>
                  </td>
                  <td className="align-middle">{baoduong.tennv}</td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleBaoDuongSelected(e, baoduong.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className="fas fa-pencil-alt text-warning"
                      onClick={(e) => handleUpdate(e, baoduong.id)}
                    >
                      &nbsp;Sửa
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <XoaBaoDuong id={baoduong.id} bd={baoduong} />
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <i
                      className="fas fa-print text-info"
                      onClick={(e) => handlePrint(e, baoduong)}
                    >
                      &nbsp;In
                    </i>
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

export default DanhSachBaoDuong;
