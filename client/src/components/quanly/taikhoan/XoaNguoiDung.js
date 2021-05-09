import React, { useContext } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
const XoaNguoiDung = ({ ten, tt }) => {
  const {
    nguoiDungList,
    setNguoiDungList,
    setMsgUserActionSuccess,
  } = useContext(AccountContext);

  const xoaNguoiDung = async (e) => {
    e.stopPropagation();
    try {
      const res = await TaiKhoanFinder.get(`/thong-tin-nguoi-dung/${ten}`);
      if (res.data.data.nguoidung.trangthai) {
        setMsgUserActionSuccess(
          "Tài khoản đang được cấp phép sử dụng, không thể xóa."
        );
        setTimeout(() => {
          setMsgUserActionSuccess("");
        }, 3500);
      } else {
        await TaiKhoanFinder.delete(`/xoa-tai-khoan/${ten}`);
        setNguoiDungList(
          nguoiDungList.filter((nguoidung) => {
            return nguoidung.ten !== ten;
          })
        );
        setMsgUserActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgUserActionSuccess("");
        }, 2000);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-danger"
        data-toggle="modal"
        data-target={`#id${ten}xoa`}
      >
        Xóa
      </button>

      <div className="modal mb-5" id={`id${ten}xoa`}>
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
                <span className="font-weight-bold">"{ten}"</span> không ?
              </p>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2"
                data-dismiss="modal"
                onClick={(e) => xoaNguoiDung(e)}
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

export default XoaNguoiDung;
