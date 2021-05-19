import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import XoaDatPhong from "./XoaDatPhong";
import { NumberFormat } from "../../../utils/DataHandler";
import { useHistory } from "react-router";
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
      default:
        break;
    }
    return result;
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgDatPhongActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Phòng</th>
              <th>Khách hàng</th>
              <th>SDT</th>
              <th>Trạng thái</th>
              <th>Tổng tiền</th>
              <th>Xem</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsDatPhong.map((datphong) => {
              return (
                <tr key={datphong.id}>
                  <td className="align-middle">{datphong.phong_id}</td>
                  <td className="align-middle">{datphong.kh_name}</td>
                  <td className="align-middle">{datphong.kh_sdt}</td>
                  <td
                    className={`align-middle ${
                      datphong.trangthai === 0 ? "text-success" : "text-info"
                    }`}
                  >
                    <u>{renderTrangThaiDP(datphong.trangthai)}</u>
                  </td>
                  <td className="text-right align-middle">
                    {NumberFormat(datphong.tongtien)} <b>VND</b>
                  </td>

                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleDPSelected(e, datphong.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {datphong.trangthai === 0 ? (
                      <XoaDatPhong id={datphong.id} />
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
