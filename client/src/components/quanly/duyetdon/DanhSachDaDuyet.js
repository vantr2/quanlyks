import React, { useEffect, useState } from "react";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import Host from "../../../hosts/Host";
import { NormalizeDate } from "../../../utils/DataHandler";
import { useHistory } from "react-router";
import XoaDanhSachDaDuyet from "./XoaDanhSachDaDuyet";

const DanhSachDaDuyet = () => {
  const [dsDaDuyet, setDsDaDuyet] = useState([]);
  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await XinNghiFinder.get("/danh-sach-da-duyet");
        setDsDaDuyet(res.data.data.xinnghi);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const handleDonSelected = (e, id) => {
    e.stopPropagation();
    hi.push(`/quan-ly/nv-quan-ly/duyet-don/${id}`);
  };

  const renderTrangThaiDon = (tt) => {
    let result;
    switch (tt + "") {
      case "0":
        result = (
          <u>
            <i className="fas fa-spinner text-info  ">&nbsp;Đang chờ</i>
          </u>
        );
        break;
      case "1":
        result = (
          <u>
            {" "}
            <i className="fas fa-check-circle text-success">&nbsp;Đồng ý</i>
          </u>
        );
        break;
      case "2":
        result = (
          <u>
            {" "}
            <i className="fas fa-ban text-danger">&nbsp;Từ chối</i>
          </u>
        );
        break;
      default:
        break;
    }
    return result;
  };

  const renderThoiGianNghi = (tg) => {
    let result;
    switch (tg + "") {
      case "0":
        result = "Nửa ngày";
        break;
      case "1":
        result = "Một ngày";
        break;
      case "2":
        result = "Một ngày rưỡi";
        break;
      case "3":
        result = "Hai ngày";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div>
      <div className="mt-5 mb-5">
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>NV xin nghỉ</th>
              <th>Ảnh</th>
              <th>SDT</th>
              <th>Ngày nghỉ</th>
              <th>Thời gian nghỉ</th>
              <th>Trạng thái</th>
              <th>Xem</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsDaDuyet.map((don) => {
              return (
                <tr key={don.id} className="text-center">
                  <td className="align-middle">{don.tennv}</td>
                  <td className="align-middle">
                    <img
                      width="100"
                      src={
                        don.avt !== "images/no-user.jpg"
                          ? don.avt
                          : Host + don.avt
                      }
                      alt="Ảnh nhân viên"
                    />
                  </td>
                  <td className="align-middle">{don.sdt}</td>
                  <td className="text-center align-middle">
                    {NormalizeDate(don.khinao)}
                  </td>
                  <td className="align-middle">
                    {renderThoiGianNghi(don.baolau)}
                  </td>
                  <td className="align-middle ">
                    {renderTrangThaiDon(don.trangthai)}
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    {" "}
                    <i
                      className="far fa-eye text-primary"
                      onClick={(e) => handleDonSelected(e, don.id)}
                    >
                      &nbsp;Xem
                    </i>
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <XoaDanhSachDaDuyet id={don.id} dsdd={don} />
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

export default DanhSachDaDuyet;
