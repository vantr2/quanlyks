import React, { useContext } from "react";
import { useHistory } from "react-router";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const XoaPhieuMuaChiTiet = ({ id, pmid }) => {
  let hi = useHistory();
  const { dsPhieuMuaChiTiet, setDsPhieuMuaChiTiet } =
    useContext(AccountContext);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await PhieuMuaFinder.delete(`/xoa-chi-tiet/${id}`);
      //   console.log(res);
      if (res.data === "") {
        setDsPhieuMuaChiTiet(
          dsPhieuMuaChiTiet.filter((pmchitiet) => {
            return pmchitiet.id !== id;
          })
        );
        hi.push("/quan-ly/ql-hang-hoa/phieu-mua");
        hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${pmid}`);
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
                Bạn có thực sự muốn xóa mặt hàng này không?
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

export default XoaPhieuMuaChiTiet;
