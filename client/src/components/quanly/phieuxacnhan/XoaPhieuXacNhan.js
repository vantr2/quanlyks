import React from "react";
import DoiHuyFinder from "../../../apis/DoiHuyFinder";
import { useHistory } from "react-router";
import ThemLichSu from "../../../utils/ThemLichSu";

const XoaPhieuXacNhan = ({ dp, type }) => {
  let hi = useHistory();
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      if (type === "dp") {
        await DoiHuyFinder.delete(`/xoa-doi-phong/${dp.id}`);
        ThemLichSu({
          doing: "Xóa",
          olddata: { old: dp },
          newdata: {},
          tbl: "Phiếu xác nhận đổi",
        });
        hi.push("/quan-ly/phong");
        hi.push("/quan-ly/phong/phieu-xac-nhan");
      } else if (type === "hp") {
        await DoiHuyFinder.delete(`/xoa-huy-phong/${dp.id}`);
        ThemLichSu({
          doing: "Xóa",
          olddata: { old: dp },
          newdata: {},
          tbl: "Phiếu xác nhận hủy",
        });
        hi.push("/quan-ly/phong");
        hi.push("/quan-ly/phong/phieu-xac-nhan");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <button
        className="btn btn-danger mr-2"
        type="button"
        data-target={`#id${dp.id}${type}xoaphong`}
        data-toggle="modal"
      >
        Xóa
      </button>
      <div className="modal fade mb-5" id={`id${dp.id}${type}xoaphong`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p>Bạn có thực sự muốn xóa phiếu xác nhận này không?</p>
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

export default XoaPhieuXacNhan;
