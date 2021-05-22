import React, { useContext, useState } from "react";

import { useHistory } from "react-router";
import DichVuFinder from "../../../apis/DichVuFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import { storage } from "../../../firebase";
import ThemLichSu from "../../../utils/ThemLichSu";
const XoaDichVu = ({ id }) => {
  const { setMsgDichVuActionSuccess, dsDichVu, setDsDichVu } =
    useContext(AccountContext);

  let hi = useHistory();
  const [filename, setFileName] = useState("");
  const [tenDV, setTenDV] = useState("");
  const [isDelete, setIsDelete] = useState(false);

  const [old, setOld] = useState({});

  const fetchData = async () => {
    try {
      const res = await DichVuFinder.get(`/danh-sach-dich-vu/${id}`);
      setFileName(res.data.data.dichvu.filename);
      setTenDV(res.data.data.dichvu.ten);
      setOld(res.data.data.dichvu);
      const res_dp = await DichVuFinder.get(`/trong-dat-phong/${id}`);
      //   console.log(res_dp);
      if (res_dp.data.data.dichvu.count === "0") {
        setIsDelete(true);
      } else {
        setIsDelete(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDelete) {
      try {
        const res = await DichVuFinder.delete(`/xoa-dich-vu/${id}`);
        //   console.log(res);
        if (res.data === "") {
          ThemLichSu({
            doing: "Xóa",
            olddata: { old: old },
            newdata: {},
            tbl: "Dịch vụ",
          });

          setMsgDichVuActionSuccess("Xóa thành công");
          setTimeout(() => {
            setMsgDichVuActionSuccess("");
          }, 2000);
          setDsDichVu(
            dsDichVu.filter((dichvu) => {
              return dichvu.id !== id;
            })
          );
          storage.ref("dichvu").child(filename).delete();
          hi.push("/quan-ly/danh-muc/dich-vu");
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert(
        "Dữ liệu của dịch vụ này đang nằm trong phiếu thuê nào đó. Không thể xóa"
      );
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
                <span className="font-weight-bold">"{tenDV}"</span> không ?
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

export default XoaDichVu;
