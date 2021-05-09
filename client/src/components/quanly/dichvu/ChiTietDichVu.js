import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import DichVuFinder from "../../../apis/DichVuFinder";
import { NumberFormat } from "../../../utils/DataHandler";

const ChiTietDichVu = () => {
  const { id } = useParams();
  let hi = useHistory();

  const [dichvuSelected, setDichVuSelected] = useState([]);
  const { msgDichVuActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DichVuFinder.get(`/danh-sach-dich-vu/${id}`);
        setDichVuSelected(res.data.data.dichvu);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setDichVuSelected, id]);

  const goBack = () => {
    hi.push("/quan-ly/danh-muc/dich-vu");
  };
  const handleUpdate = () => {
    hi.push(`/quan-ly/danh-muc/dich-vu/${id}/sua`);
  };

  const renderTrangThai = (tt) => {
    let trangthai = "";
    switch (tt + "") {
      case "0":
        trangthai = "Không còn cung cấp";
        break;
      case "1":
        trangthai = "Có thể cung cấp";
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
      <p className="text-center text-success">{msgDichVuActionSuccess}</p>
      <h4 className="mt-3 mb-3">{dichvuSelected.ten}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tên dịch vụ</td>
            <td className="col-9 pl-2">{dichvuSelected.ten}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Trạng thái</td>
            <td className="col-9 pl-2">
              {renderTrangThai(dichvuSelected.trangthai)}
            </td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Giá dịch vụ</td>
            <td className="col-9 pl-2">
              {NumberFormat(dichvuSelected.giahientai)}&nbsp;<b>VND</b>
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ảnh minh họa</td>
            <td className="col-9 pl-2">
              <img
                src={dichvuSelected.anhminhhoa}
                alt="Ảnh dịch vụ"
                width="300"
              />
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Loại dịch vụ</td>
            <td className="col-9 pl-2">{dichvuSelected.label}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ghi chú</td>
            <td
              className="col-9 pl-2"
              dangerouslySetInnerHTML={{ __html: dichvuSelected.ghichu }}
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ChiTietDichVu;
