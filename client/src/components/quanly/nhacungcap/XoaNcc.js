import React, { useContext, useState } from "react";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import { AccountContext } from "../../../contexts/AccountContext";
const XoaNcc = ({ id }) => {
  const { setMsgNccActionSuccess, dsNcc, setDsNcc } = useContext(
    AccountContext
  );
  const [tenNcc, setTenNcc] = useState("");
  const fetchData = async () => {
    try {
      const res = await NhaCungCapFinder.get(`/danh-sach/${id}`);
      setTenNcc(res.data.data.nhacungcap.ten);
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await NhaCungCapFinder.delete(`/xoa/${id}`);
      //   console.log(res);
      if (res.data === "") {
        setMsgNccActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgNccActionSuccess("");
        }, 2000);
        setDsNcc(
          dsNcc.filter((ncc) => {
            return ncc.id !== id;
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
        onClick={fetchData}
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
                <span className="font-weight-bold">"{tenNcc}"</span> không ?
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
