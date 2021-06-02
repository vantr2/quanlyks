import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import { convertTime, NormalizeDate } from "../../../utils/DataHandler";
const ChiTietXinNghi = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [donSelected, setDonSelected] = useState([]);
  const { msgDonActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await XinNghiFinder.get(`/danh-sach-full-theo-id/${id}`);
        setDonSelected(res.data.data.xinnghi);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setDonSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/nhan-vien/xin-nghi");
  };
  const handleUpdate = () => {
    hi.push(`/quan-ly/nhan-vien/xin-nghi/${id}/sua`);
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
        {donSelected.trangthai === 0 ? (
          <div className="mt-5 ml-2">
            <button className="btn btn-warning px-4" onClick={handleUpdate}>
              Sửa
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
      <p className="text-center text-success">{msgDonActionSuccess}</p>
      <h4 className="mt-3 mb-3">{donSelected.tennv}</h4>

      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên nhân viên</td>
            <td className="col-9 pl-2">{donSelected.tennv}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Thời gian viết/sửa đơn
            </td>
            <td className="col-9 pl-2">
              {NormalizeDate(donSelected.tgvietdon)}&nbsp;
              {convertTime(donSelected.tgvietdon)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày xin nghỉ</td>
            <td className="col-9 pl-2">{NormalizeDate(donSelected.khinao)}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Thời gian nghỉ</td>
            <td className="col-9 pl-2">
              {renderThoiGianNghi(donSelected.baolau)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              <u>{renderTrangThaiDon(donSelected.trangthai)}</u>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Lý do nghỉ</td>
            <td className="col-9 pl-2">{donSelected.lydo}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên người duyệt đơn</td>
            <td className="col-9 pl-2">
              {donSelected.nguoiduyet ? donSelected.nguoiduyet : "Chưa duyệt"}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ghi chú duyệt đơn</td>
            <td className="col-9 pl-2">
              {donSelected.ph_nguoiduyet
                ? donSelected.ph_nguoiduyet
                : "Chưa duyệt"}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Thời gian duyệt</td>
            <td className="col-9 pl-2">
              {donSelected.tgduyet
                ? "Ngày: " +
                  NormalizeDate(donSelected.tgduyet) +
                  ", lúc " +
                  convertTime(donSelected.tgduyet)
                : "Chưa duyệt"}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietXinNghi;
