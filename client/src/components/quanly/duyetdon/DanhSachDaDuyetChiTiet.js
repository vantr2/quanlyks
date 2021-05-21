import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import { convertTime, NormalizeDate } from "../../../utils/DataHandler";

const DanhSachDaDuyetChiTiet = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [donDaDuyetSelected, setDonDaDuyetSelected] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await XinNghiFinder.get(`/danh-sach-da-duyet/${id}`);
        setDonDaDuyetSelected(res.data.data.xinnghi);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [id, setDonDaDuyetSelected]);

  const goBack = () => {
    hi.push("/quan-ly/nv-quan-ly/duyet-don");
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
            <i class="fas fa-ban text-danger">&nbsp;Từ chối</i>
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
      <div className="d-flex flex-row">
        <button className="btn btn-primary mt-5" onClick={goBack}>
          Quay lại
        </button>
      </div>
      <h4 className="mt-3 mb-3">{donDaDuyetSelected.tennv}</h4>

      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên nhân viên</td>
            <td className="col-9 pl-2">{donDaDuyetSelected.tennv}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày xin nghỉ</td>
            <td className="col-9 pl-2">
              {NormalizeDate(donDaDuyetSelected.khinao)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Thời gian nghỉ</td>
            <td className="col-9 pl-2">
              {renderThoiGianNghi(donDaDuyetSelected.baolau)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              <u>{renderTrangThaiDon(donDaDuyetSelected.trangthai)}</u>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Lý do nghỉ</td>
            <td className="col-9 pl-2">{donDaDuyetSelected.lydo}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên người duyệt đơn</td>
            <td className="col-9 pl-2">{donDaDuyetSelected.nguoiduyet}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ghi chú duyệt đơn</td>
            <td className="col-9 pl-2">{donDaDuyetSelected.ph_nguoiduyet}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Thời gian duyệt</td>
            <td className="col-9 pl-2">
              {"Ngày: " +
                NormalizeDate(donDaDuyetSelected.tgduyet) +
                ", lúc " +
                convertTime(donDaDuyetSelected.tgduyet)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DanhSachDaDuyetChiTiet;
