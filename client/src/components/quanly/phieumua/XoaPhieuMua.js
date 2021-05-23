import React, { useContext } from "react";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";

const XoaPhieuMua = ({ id, pm }) => {
  const { setMsgPhieuMuaActionSuccess, dsPhieuMua, setDsPhieuMua } =
    useContext(AccountContext);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await PhieuMuaFinder.delete(`/xoa/${id}`);
      //   console.log(res);
      if (res.data === "") {
        ThemLichSu({
          doing: "Xóa",
          olddata: { old: pm },
          newdata: {},
          tbl: "Phiếu mua hàng",
        });
        setMsgPhieuMuaActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgPhieuMuaActionSuccess("");
        }, 2000);
        setDsPhieuMua(
          dsPhieuMua.filter((pm) => {
            return pm.id !== id;
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
        data-target={`#id${id}xoapm`}
      >
        &nbsp;Xóa
      </i>

      <div className="modal fade mb-5" id={`id${id}xoapm`}>
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
                Bạn có thực sự muốn xóa phiếu mua hàng này không ?
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

export default XoaPhieuMua;
