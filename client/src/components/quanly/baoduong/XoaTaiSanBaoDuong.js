import React, { useContext, useState } from "react";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";
const XoaTaiSanBaoDuong = ({ tsId, id, bdID, bdct }) => {
  const { dsBaoDuongChiTiet, setDsBaoDuongChiTiet } =
    useContext(AccountContext);

  const [tenTs, setTenTs] = useState("");

  const fetchData = async () => {
    try {
      const res = await TaiSanFinder.get(`/danh-sach-tai-san/${tsId}`);
      setTenTs(res.data.data.taisan.ten);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await BaoDuongFinder.delete(`/xoa-chi-tiet/${id}`);
      //   console.log(res);
      if (res.data === "") {
        ThemLichSu({
          doing: "Xóa",
          olddata: { old: bdct },
          newdata: {},
          tbl: "Phiếu bảo dưỡng chi tiết",
        });

        setDsBaoDuongChiTiet(
          dsBaoDuongChiTiet.filter((bdchitiet) => {
            return bdchitiet.id !== id;
          })
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <i
        className="fas fa-trash p-1 text-danger"
        data-toggle="modal"
        data-target={`#id${id}xoa`}
        onClick={fetchData}
      ></i>

      <div className="modal fade mb-5" id={`id${id}xoa`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="text-left">
                Bạn có thực sự muốn xóa{" "}
                <span className="font-weight-bold">"{tenTs}"</span> không ?
              </p>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
                data-dismiss="modal"
                onClick={(e) => handleDelete(e)}
              >
                Có
              </button>
              <button
                type="button"
                className="btn btn-secondary font-weight-bold ml-2"
                data-dismiss="modal"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XoaTaiSanBaoDuong;
