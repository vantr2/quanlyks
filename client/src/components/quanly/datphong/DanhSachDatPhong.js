import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DatPhongFinder from "../../../apis/DatPhongFinder";
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
          border: "1px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#2640eb",
        };
        break;
      case "1":
        sty = {
          height: "16px",
          border: "1px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#24e3dd",
        };
        break;
      case "2":
        sty = {
          height: "16px",
          border: "1px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#2fed39",
        };
        break;
      case "3":
        sty = {
          height: "16px",
          border: "1px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#b3e33b",
        };
        break;
      case "4":
        sty = {
          height: "16px",
          border: "1px solid black",
          borderRadius: "8px",
          marginRight: "0.5rem",
          backgroundColor: "#f5c536",
        };
        break;
      case "5":
        sty = {
          height: "16px",
          border: "1px solid black",
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

  return (
    <div>
      <div className="mt-5 mb-5">
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
              <th>Tiền dịch vụ</th>
              <th>Xem</th>
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
                    {NumberFormat(datphong.tongtien)} <b>VND</b>
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
