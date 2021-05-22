import React, { useContext, useState } from "react";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import { useHistory } from "react-router";
import ThemLichSu from "../../../utils/ThemLichSu";

const XoaNhanVienType2 = ({ id, tenNV, nv }) => {
  let hi = useHistory();
  const { setMsgNhanVienActionSuccess } = useContext(AccountContext);
  const [isDel, setIsDel] = useState(false);
  const [isHd, setIsHd] = useState(false);
  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!isDel) {
      setMsgNhanVienActionSuccess(
        "Nhân viên này không thể xóa. Vì nó đang nằm ở đâu đó trong hóa đơn và đặt phòng."
      );
      setTimeout(() => {
        setMsgNhanVienActionSuccess("");
      }, 4000);
    } else if (!isHd) {
      setMsgNhanVienActionSuccess(
        "Tài khoản câp cho nhân viên này đang hoạt động. Không thể xóa"
      );
      setTimeout(() => {
        setMsgNhanVienActionSuccess("");
      }, 4000);
    } else {
      try {
        const res = await NhanVienFinder.delete(`/xoa-nhan-vien/${id}`);
        //   console.log(res);
        if (res.data === "") {
          ThemLichSu({
            doing: "Xóa",
            olddata: { old: nv },
            newdata: {},
            tbl: "Nhân viên",
          });
          setMsgNhanVienActionSuccess("Xóa thành công");
          setTimeout(() => {
            setMsgNhanVienActionSuccess("");
          }, 2000);
          hi.push("/quan-ly/danh-muc");
          hi.push("/quan-ly/danh-muc/nhan-vien");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  const handleClick = async () => {
    try {
      const res_hd = await NhanVienFinder.get(`/trong-hoa-don/${id}`);
      //   console.log(res_hd);
      if (res_hd.data.data.nhanvien.count === "0") {
        setIsDel(true);
      } else {
        setIsDel(false);
      }

      const res_dp = await NhanVienFinder.get(`/trong-dat-phong/${tenNV}`);
      //   console.log(res_dp);
      if (res_dp.data.data.nhanvien.count === "0") {
        setIsDel(true);
      } else {
        setIsDel(false);
      }

      const res_hdong = await NhanVienFinder.get(`/kiem-tra-hoat-dong/${id}`);
      //   console.log(res_dp);
      if (res_hdong.data.data.nhanvien.count === "0") {
        setIsHd(true);
      } else {
        setIsHd(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <i
        className="fas fa-trash text-danger"
        onClick={handleClick}
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
                Bạn có thực sự muốn xóa{" "}
                <span className="font-weight-bold">"{tenNV}"</span> không ?
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

export default XoaNhanVienType2;
