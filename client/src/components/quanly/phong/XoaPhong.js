import React, { useContext, useEffect, useState } from "react";

import { useHistory } from "react-router";
import PhongFinder from "../../../apis/PhongFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import { storage } from "../../../firebase";
const XoaPhong = ({ ten }) => {
  const { setMsgPhongActionSuccess, dsPhong, setDsPhong } = useContext(
    AccountContext
  );

  let hi = useHistory();
  const [filename, setFileName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhongFinder.get(`/danh-sach-phong/${ten}`);
        setFileName(res.data.data.phong.filename);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setFileName, ten]);

  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await PhongFinder.delete(`/xoa-phong/${ten}`);
      //   console.log(res);
      if (res.data === "") {
        setMsgPhongActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgPhongActionSuccess("");
        }, 2000);
        setDsPhong(
          dsPhong.filter((phong) => {
            return phong.ten !== ten;
          })
        );
        storage.ref("phong").child(filename).delete();
        hi.push("/quan-ly/danh-muc/phong");
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
        data-target={`#id${ten}xoa`}
      >
        &nbsp;Xóa
      </i>

      <div className="modal fade mb-5" id={`id${ten}xoa`}>
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

export default XoaPhong;
