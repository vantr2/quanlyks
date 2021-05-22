import React, { useContext } from "react";
import { useHistory } from "react-router";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";
const ResetPassword = ({ ten }) => {
  let hi = useHistory();
  const { setMsgUserActionSuccess } = useContext(AccountContext);
  const resetPassword = async () => {
    try {
      const res = await TaiKhoanFinder.put("/cai-dat-lai-mat-khau", {
        ten: ten,
      });

      setMsgUserActionSuccess("Đặt lại mật khẩu thành công");
      setTimeout(() => {
        setMsgUserActionSuccess("");
      }, 2000);

      ThemLichSu({
        doing: "Reset mật khẩu",
        olddata: { taikhoan: ten },
        newdata: { taikhoan: ten },
        tbl: "Người dùng",
      });

      hi.push("/quan-ly");
      hi.push("/quan-ly/admin/tai-khoan");
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <i
        className="fas fa-undo-alt text-danger"
        data-toggle="modal"
        data-target={`#id${ten}resetpw`}
      >
        &nbsp; Reset
      </i>

      <div className="modal mb-5" id={`id${ten}resetpw`}>
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
                Bạn muốn cài đặt lại mật khẩu cho{" "}
                <span className="font-weight-bold">"{ten}"</span> không ?
              </p>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2"
                data-dismiss="modal"
                onClick={resetPassword}
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

export default ResetPassword;
