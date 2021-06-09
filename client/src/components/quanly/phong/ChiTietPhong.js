import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import PhongFinder from "../../../apis/PhongFinder";
import { NumberFormat } from "../../../utils/DataHandler";

const ChiTietPhong = () => {
  const { ten } = useParams();
  let hi = useHistory();

  const [phongSelected, setPhongSelected] = useState([]);
  const { msgPhongActionSuccess } = useContext(AccountContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhongFinder.get(`/danh-sach-phong/${ten}`);
        setPhongSelected(res.data.data.phong);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setPhongSelected, ten]);

  const goBack = () => {
    hi.push("/quan-ly/danh-muc/phong");
  };

  const renderTrangThai = (tt) => {
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
        trangthai = "Chờ hóa đơn.";
        break;
      case "4":
        trangthai = "Chưa thanh toán.";
        break;
      case "5":
        trangthai = "Đang dọn.";
        break;
      case "6":
        trangthai = "Đang sửa chữa.";
        break;
      default:
        break;
    }
    return trangthai;
  };

  const handleUpdate = () => {
    hi.push(`/quan-ly/danh-muc/phong/${ten}/sua`);
  };
  const handleBroken = async () => {
    await PhongFinder.put("/update-tt", {
      ten: ten,
      trangthai: 6,
    });
    hi.push("/quan-ly/danh-muc");
    hi.push(`/quan-ly/danh-muc/phong/${ten}/`);
  };
  const handleRepair = async () => {
    await PhongFinder.put("/update-tt", {
      ten: ten,
      trangthai: 0,
    });
    hi.push("/quan-ly/danh-muc");
    hi.push(`/quan-ly/danh-muc/phong/${ten}/`);
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
        {phongSelected.trangthai === 6 ? (
          <div className="mt-5 ml-2">
            <button className="btn btn-info px-4" onClick={handleRepair}>
              Đã sửa chữa
            </button>
          </div>
        ) : (
          <div className="mt-5 ml-2">
            <button className="btn btn-danger px-4" onClick={handleBroken}>
              Bị hỏng
            </button>
          </div>
        )}
      </div>
      <p className="text-center text-success">{msgPhongActionSuccess}</p>
      <h4 className="mt-3 mb-3">{phongSelected.ten}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên phòng</td>
            <td className="col-9 pl-2">{phongSelected.ten}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              {renderTrangThai(phongSelected.trangthai)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Giá phòng theo ngày</td>
            <td className="col-9 pl-2">
              {NumberFormat(phongSelected.giaphongtheongay)}&nbsp;<b>VND</b>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Giá phòng theo giờ</td>
            <td className="col-9 pl-2">
              {NumberFormat(phongSelected.giaphongtheogio)}&nbsp;<b>VND</b>
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Loại phòng</td>
            <td className="col-9 pl-2">{phongSelected.loaiphong}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ảnh phòng</td>
            <td className="col-9 pl-2">
              <img src={phongSelected.anh} alt="Ảnh phòng" width="300" />
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tiêu đề phòng</td>
            <td className="col-9 pl-2">{phongSelected.tieude}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Mô tả ngắn gọn</td>
            <td className="col-9 pl-2">{phongSelected.mota_ngangon}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Mô tả chi tiết</td>
            <td
              className="col-9 pl-2"
              dangerouslySetInnerHTML={{ __html: phongSelected.mota_chitiet }}
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietPhong;
