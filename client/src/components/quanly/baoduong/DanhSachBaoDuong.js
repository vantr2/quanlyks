import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { useHistory } from "react-router";
import { NormalizeDate, NumberFormat } from "../../../utils/DataHandler";
import XoaBaoDuong from "./XoaBaoDuong";
const DanhSachBaoDuong = () => {
  const { dsBaoDuong, setDsBaoDuong, msgBaoDuongActionSuccess } = useContext(
    AccountContext
  );

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
                    <XoaBaoDuong id={baoduong.id} />
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
