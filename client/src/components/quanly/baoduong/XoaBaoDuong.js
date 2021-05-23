import React, { useContext } from "react";

import { useHistory } from "react-router";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";
const XoaBaoDuong = ({ id, bd }) => {
  const { setMsgBaoDuongActionSuccess, dsBaoDuong, setDsBaoDuong } =
    useContext(AccountContext);

  let hi = useHistory();

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await BaoDuongFinder.delete(`/xoa/${id}`);
      //   console.log(res);
      if (res.data === "") {
        ThemLichSu({
          doing: "Xóa",
          olddata: { old: bd },
          newdata: {},
          tbl: "Phiếu bảo dưỡng",
        });

        setMsgBaoDuongActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgBaoDuongActionSuccess("");
        }, 2000);
        setDsBaoDuong(
          dsBaoDuong.filter((baoduong) => {
            return baoduong.id !== id;
          })
        );
        hi.push("/quan-ly/ql-tai-san/bao-duong");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <i
        className="fas fa-trash text-danger"
        data-toggle="modal"
        data-target={`#id${id}xoa`}
      >
        &nbsp;Xóa
      </i>

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
                Bạn có thực sự muốn xóa phiếu bảo dưỡng này không ?
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

export default XoaBaoDuong;
