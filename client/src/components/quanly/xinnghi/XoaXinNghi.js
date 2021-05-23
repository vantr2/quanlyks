import React, { useContext } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import ThemLichSu from "../../../utils/ThemLichSu";

const XoaXinNghi = ({ id, xn }) => {
  const { setMsgDonActionSuccess, dsDon, setDsDon } =
    useContext(AccountContext);
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await XinNghiFinder.delete(`/xoa/${id}`);
      //   console.log(res);
      if (res.data === "") {
        ThemLichSu({
          doing: "Xóa",
          olddata: { old: xn },
          newdata: {},
          tbl: "Đơn xin nghỉ",
        });
        setMsgDonActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgDonActionSuccess("");
        }, 2000);
        setDsDon(
          dsDon.filter((don) => {
            return don.id !== id;
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
                Bạn có thực sự muốn xóa đơn xin nghỉ này không ?
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

export default XoaXinNghi;
