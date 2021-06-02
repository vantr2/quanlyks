import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DatPhongOnlineFinder from "../../../apis/DatPhongOnlineFinder";
import { useHistory } from "react-router";
import { convertTime, NormalizeDate } from "../../../utils/DataHandler";
const DanhSachDatPhongOnline = () => {
  const { dsDpOnline, setDsDpOnline } = useContext(AccountContext);
  let hi = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DatPhongOnlineFinder.get("/danh-sach");
        if (res.data.status === "ok") {
          setDsDpOnline(res.data.data.dponline);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsDpOnline]);

  const handleDPOLSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/phong/dat-phong-online/${id}`);
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Tên khách hàng</th>
              <th>SDT</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Số phòng</th>
              <th>Loại phòng</th>
              <th>Trạng thái</th>
              <th>Xem</th>
            </tr>
          </thead>
          <tbody>
            {dsDpOnline.map((dpol) => {
              return (
                <tr key={dpol.id} className="text-center">
                  <td className="align-middle">{dpol.khname}</td>
                  <td className="align-middle">{dpol.khsdt}</td>
                  <td>
                    {NormalizeDate(dpol.checkin)}&nbsp;
                    {convertTime(dpol.checkin)}
                  </td>
                  <td>
                    {NormalizeDate(dpol.checkout)}&nbsp;
                    {convertTime(dpol.checkout)}
                  </td>
                  <td className="align-middle">{dpol.soluongphong}</td>
                  <td className="align-middle">{dpol.loaiphong}</td>
                  <td>
                    <i
                      className={
                        dpol.trangthai === 0
                          ? "far fa-circle text-info"
                          : dpol.trangthai === 1
                          ? "far fa-check-circle text-success"
                          : "fas fa-ban text-danger"
                      }
                    >
                      &nbsp;
                      {dpol.trangthai === 0
                        ? "Đang chờ"
                        : dpol.trangthai === 1
                        ? "Đã đáp ứng"
                        : "Không thể đáp ứng"}
                    </i>
                  </td>
                  <td className="align-middle" style={{ cursor: "pointer" }}>
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleDPOLSelected(e, dpol.id)}
                    >
                      &nbsp;Xem
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

export default DanhSachDatPhongOnline;
