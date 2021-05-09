import React, { useContext, useEffect, useState } from "react";

import { useHistory } from "react-router";
import DichVuFinder from "../../../apis/DichVuFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import { storage } from "../../../firebase";
const XoaDichVu = ({ id }) => {
  const { setMsgDichVuActionSuccess, dsDichVu, setDsDichVu } = useContext(
    AccountContext
  );

  let hi = useHistory();
  const [filename, setFileName] = useState("");
  const [tenDV, setTenDV] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DichVuFinder.get(`/danh-sach-dich-vu/${id}`);
        setFileName(res.data.data.dichvu.filename);
        setTenDV(res.data.data.dichvu.ten);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setFileName, id]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await DichVuFinder.delete(`/xoa-dich-vu/${id}`);
      //   console.log(res);
      if (res.data === "") {
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
