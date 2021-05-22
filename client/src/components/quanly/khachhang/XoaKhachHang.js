import React, { useContext, useState } from "react";

import { useHistory } from "react-router";
import KhachHangFinder from "../../../apis/KhachHangFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";
const XoaKhachHang = ({ id, name, kh }) => {
  let hi = useHistory();

  const { setMsgKHActionSuccess } = useContext(AccountContext);
  const [isDeleteDp, setIsDeleteDp] = useState(false);
  const [isDeleteHd, setIsDeleteHd] = useState(false);

  const checkIdKh = async () => {
    try {
      const res_hd = await KhachHangFinder.get(`/trong-hoa-don/${id}`);
      //   console.log(res_hd);
      if (res_hd.data.data.khachhang.count === "0") {
        setIsDeleteDp(true);
      } else {
        setIsDeleteDp(false);
      }

      const res_dp = await KhachHangFinder.get(`/trong-dat-phong/${id}`);
      //   console.log(res_dp);
      if (res_dp.data.data.khachhang.count === "0") {
        setIsDeleteHd(true);
      } else {
        setIsDeleteHd(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleDelete = async (e) => {
    e.stopPropagation();
    // console.log(isDelete);
    if (isDeleteDp && isDeleteHd) {
      try {
        const res = await KhachHangFinder.delete(`/xoa/${id}`);
        //   console.log(res);
        if (res.data === "") {
          ThemLichSu({
            doing: "Xóa",
            olddata: { old: kh },
            newdata: {},
            tbl: "Khách hàng",
          });
          setMsgKHActionSuccess("Xóa thành công");
          setTimeout(() => {
            setMsgKHActionSuccess("");
          }, 2000);

          hi.push("/quan-ly");
          hi.push("/quan-ly/khach-hang");
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert(
        "Khách hàng này đang đặt phòng, hoặc đang tồn tại trong 1 hóa đơn nào đó. Không thể xóa"
      );
    }
  };
  return (
    <div>
      <i
        className="fa fa-trash text-danger"
        data-toggle="modal"
        data-target={`#id${id}xoakh`}
        onClick={checkIdKh}
      >
        &nbsp;Xóa
      </i>

      <div className="modal fade mb-5" id={`id${id}xoakh`}>
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
                <span className="font-weight-bold">"{name}"</span> không ?
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

export default XoaKhachHang;
