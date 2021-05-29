import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import HoaDonFinder from "../../../../apis/HoaDonFinder";
import DatPhongFinder from "../../../../apis/DatPhongFinder";
import {
  NormalizeDate,
  convertTime,
  NumberFormat,
} from "../../../../utils/DataHandler";
const InHoaDon = () => {
  let hi = useHistory();
  const [hoadon, setHoaDon] = useState([]);
  const [hoadonct, setHoaDonCt] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    const getHoaDon = async () => {
      try {
        const res = await HoaDonFinder.get(`/danh-sach/${id}`);
        setHoaDon(res.data.data.hoadon);
        console.log(res.data.data.hoadon);
      } catch (er) {
        console.log(er.message);
      }
    };
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

    getHoaDon();
    getHoaDonCT();
  }, [id, setHoaDonCt, hi]);

  //   const printBill = () => {
  //     const divContents = document.getElementById("printbill").innerHTML;
  //     const a = window.open("", "", "height=500, width=1000");
  //     a.document.write("<html>");
  //     a.document.write("<body >");
  //     a.document.write(divContents);
  //     a.document.write("</body></html>");
  //     a.document.close();
  //     a.focus();
  //     a.print();
  //   };
  return (
    <div className="mt-5" id="printbill">
      <div
        className="w-50 py-3"
        style={{ border: "3px solid #515151", borderRadius: "4px" }}
      >
        <h3 className="text-center mb-4" onClick={() => window.print()}>
          HÓA ĐƠN
        </h3>

        <ul className="list-group">
          <li className="list-group-item border border-dark border-bottom-0 border-left-0 border-right-0">
            <p>Đơn vị: KHÁCH SẠN MINH LONG</p>
            <p>Sô điện thoại: 1800 6145 - 0904 579 079</p>
            <p>
              Địa chỉ: Số 11 khu A, Tập thể Quân Đội, Cầu Niệm, đường Trần
              Nguyên Hãn, quận Lê Chân, Hải Phòng
            </p>
          </li>
          <li className="list-group-item border border-dark border-bottom-0 border-left-0 border-right-0">
            <div className="row">
              <div className="col">
                <p>Khách hàng: {hoadon.kh_name}</p>
              </div>
              <div className="col">
                <p>Số điện thoại: {hoadon.kh_sdt}</p>
              </div>
            </div>

            <div className="row">
              <div className="col">
                <p>Nhân viên: {hoadon.nv_name}</p>
              </div>
              <div className="col">
                <p>Số điện thoại: {hoadon.nv_sdt}</p>
              </div>
            </div>
            <p>
              Ngày lập phiếu: {NormalizeDate(hoadon.ngaylap)}&nbsp;
              {convertTime(hoadon.ngaylap)}
            </p>
          </li>
          {hoadonct.map((hdct) => {
            return (
              <li
                className="list-group-item border border-dark border-bottom-0 border-left-0 border-right-0"
                key={hdct.id}
              >
                Phòng: <strong>{hdct.phong}</strong>
                <table className="table table-bordered">
                  <thead>
                    <tr className="text-center">
                      <th>Tên</th>
                      <th>Đơn giá</th>
                      <th>SL</th>
                      <th>ĐVT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Tiền thuê phòng</td>
                      <td className="text-right">
                        <strong>{NumberFormat(hdct.giathue)}</strong> VND
                      </td>
                      <td className="text-center">{hdct.sotgthue}</td>
                      <td className="text-center">
                        {hdct.kieuthue === "Thuê theo ngày" ? "ngày" : "giờ"}
                      </td>
                    </tr>
                    {hdct.dichvu.map((dv) => {
                      return (
                        <tr key={dv.dichvu_id}>
                          <td>{dv.dv_name}</td>
                          <td className="text-right">
                            <strong>{NumberFormat(dv.gia)}</strong> VND
                          </td>
                          <td className="text-center">{dv.soluong}</td>
                          <td className="text-center">lần</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td colSpan="4">
                        Tiền cọc :{" "}
                        <strong>{NumberFormat(hdct.dp_tiencoc)}</strong> VND
                      </td>
                    </tr>
                    {hdct.tienphat + "" !== "0" ? (
                      <tr>
                        <td colSpan="4">
                          Tiền phạt :{" "}
                          <strong>{NumberFormat(hdct.tienphat)}</strong> VND
                        </td>
                      </tr>
                    ) : (
                      ""
                    )}
                  </tbody>
                </table>
              </li>
            );
          })}
          <li className="list-group-item border border-dark border-bottom-0 border-left-0 border-right-0">
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Thành tiền: </td>
                  <td className="text-right">
                    +<strong>{NumberFormat(hoadon.thanhtien)}</strong> VND
                  </td>
                </tr>
                <tr>
                  <td>Thuế GTGT: </td>
                  <td className="text-right">
                    +
                    <strong>
                      {NumberFormat(
                        parseInt(hoadon.thanhtien) * (hoadon.vat / 100)
                      )}
                    </strong>{" "}
                    VND
                  </td>
                </tr>

                {hoadon.tongphat + "" !== "0" ? (
                  <tr>
                    <td>Tổng phạt: </td>
                    <td className="text-right">
                      +<strong>{NumberFormat(hoadon.tongphat)}</strong> VND
                    </td>
                  </tr>
                ) : (
                  ""
                )}

                <tr>
                  <td>Tổng cọc: </td>
                  <td className="text-right">
                    -<strong>{NumberFormat(hoadon.tongcoc)}</strong> VND
                  </td>
                </tr>

                <tr>
                  <td>Thanh toán: </td>
                  <td className="text-right">
                    =<strong>{NumberFormat(hoadon.tongtien)}</strong> VND
                  </td>
                </tr>
              </tbody>
            </table>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default InHoaDon;
