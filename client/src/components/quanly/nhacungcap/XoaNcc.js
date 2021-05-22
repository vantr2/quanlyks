import React, { useContext, useState } from "react";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";
const XoaNcc = ({ ncc }) => {
  const { setMsgNccActionSuccess, dsNcc, setDsNcc } =
    useContext(AccountContext);
  const [isDeleteTs, setIsDeleteTs] = useState(false);
  const [isDeletePm, setIsDeletePm] = useState(false);

  const checkDel = async () => {
    try {
      const res_ts = await NhaCungCapFinder.get(`/trong-tai-san/${ncc.id}`);
      if (res_ts.data.data.nhacungcap.count === "0") {
        setIsDeleteTs(true);
      } else {
        setIsDeleteTs(false);
      }

      const res_pmct = await NhaCungCapFinder.get(
        `/trong-pm-chi-tiet/${ncc.id}`
      );

      if (res_pmct.data.data.nhacungcap.count === "0") {
        setIsDeletePm(true);
      } else {
        setIsDeletePm(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDeleteTs && isDeletePm) {
      try {
        const res = await NhaCungCapFinder.delete(`/xoa/${ncc.id}`);
        //   console.log(res);
        if (res.data === "") {
          ThemLichSu({
            doing: "Xóa",
            olddata: { old: ncc },
            newdata: {},
            tbl: "Nhà cung cấp",
          });

          setMsgNccActionSuccess("Xóa thành công");
          setTimeout(() => {
            setMsgNccActionSuccess("");
          }, 2000);
          setDsNcc(
            dsNcc.filter((nhacc) => {
              return nhacc.id !== ncc.id;
            })
          );
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert(
        "Dữ liệu nhà cung cáp này đang được sử dụng tại tài sản hoặc phiếu mua chi tiết. Không thể xóa."
      );
    }
  };
  return (
    <div>
      <i
        className="fas fa-trash text-danger"
        data-toggle="modal"
        data-target={`#id${ncc.id}xoa`}
        onClick={checkDel}
      >
        &nbsp;Xóa
      </i>

      <div className="modal fade mb-5" id={`id${ncc.id}xoa`}>
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
                <span className="font-weight-bold">"{ncc.ten}"</span> không ?
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

export default XoaNcc;
