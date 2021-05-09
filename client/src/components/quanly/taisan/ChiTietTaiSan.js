import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import { NumberFormat, NormalizeDate } from "../../../utils/DataHandler";

const ChiTietTaiSan = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [taisanSelected, setTaiSanSelected] = useState([]);
  const { msgTaiSanActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await TaiSanFinder.get(`/danh-sach-tai-san/${id}`);
        setTaiSanSelected(res.data.data.taisan);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setTaiSanSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/ql-tai-san/thong-tin");
  };
  const handleUpdate = () => {
    hi.push(`/quan-ly/ql-tai-san/thong-tin/${id}/sua`);
  };

  const renderTrangThai = (tt) => {
    let trangthai = "";
    switch (tt + "") {
      case "0":
        trangthai = "Bị hỏng";
        break;
      case "1":
        trangthai = "Hoạt động tốt";
        break;
      case "2":
        trangthai = "Đang bảo dưỡng";
        break;
      default:
        break;
    }
    return trangthai;
  };
  return (
    <div>
      <div className="d-flex flex-row">
        <button className="btn btn-primary mt-5" onClick={goBack}>
          Quay lại
        </button>
        <div className="mt-5 ml-2">
          <button className="btn btn-warning px-4" onClick={handleUpdate}>
            Sửa
          </button>
        </div>
      </div>
      <p className="text-center text-success">{msgTaiSanActionSuccess}</p>
      <h4 className="mt-3 mb-3">{taisanSelected.ten}</h4>

      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên tài sản</td>
            <td className="col-9 pl-2">{taisanSelected.ten}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              <u>{renderTrangThai(taisanSelected.trangthai)}</u>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Giá tài sản</td>
            <td className="col-9 pl-2">
              {NumberFormat(taisanSelected.giataisan)}&nbsp;<b>VND</b>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày mua</td>
            <td className="col-9 pl-2">
              {NormalizeDate(taisanSelected.ngaymua)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Bảo dưỡng lần cuối</td>
            <td className="col-9 pl-2">
              {NormalizeDate(taisanSelected.bdlancuoi)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Vị trí</td>
            <td className="col-9 pl-2">{taisanSelected.vitri}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Loại tài sản</td>
            <td className="col-9 pl-2">{taisanSelected.loaitaisan_name}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Đơn vị tính</td>
            <td className="col-9 pl-2">{taisanSelected.donvitinh_name}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Nhà cung cấp</td>
            <td className="col-9 pl-2">{taisanSelected.nhacc_name}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Địa chỉ nhà cung cấp
            </td>
            <td className="col-9 pl-2">{taisanSelected.nhacc_diachi}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Số điện thoại liên hệ
            </td>
            <td className="col-9 pl-2">{taisanSelected.nhacc_sdt}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ghi chú</td>
            <td
              className="col-9 pl-2"
              dangerouslySetInnerHTML={{ __html: taisanSelected.ghichu }}
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietTaiSan;
