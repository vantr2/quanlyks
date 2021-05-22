import React, { useState } from "react";
import DoiHuyFinder from "../../../apis/DoiHuyFinder";
import { useHistory } from "react-router";
import ThemLichSu from "../../../utils/ThemLichSu";
const SuaPhieuXacNhan = ({ type, id }) => {
  const [lydo, setLydo] = useState("");
  let hi = useHistory();

  const [old, setOld] = useState({});

  const onClick = async () => {
    try {
      if (type === "dp") {
        const res = await DoiHuyFinder.get(`/danh-sach-doi/${id}`);
        setLydo(res.data.data.doiphong.lydodoi);
        setOld({
          id: id,
          lydodoi: res.data.data.doiphong.lydodoi,
        });
      } else if (type === "hp") {
        const res = await DoiHuyFinder.get(`/danh-sach-huy/${id}`);
        setLydo(res.data.data.huyphong.lydohuy);
        setOld({
          id: id,
          lydohuy: res.data.data.huyphong.lydohuy,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.stopPropagation();
    if (lydo) {
      try {
        if (type === "dp") {
          const res = await DoiHuyFinder.put("/sua-ly-do-doi", {
            id: id,
            lydodoi: lydo,
          });
          if (res.data.status === "ok") {
            const newd = { id: id, lydodoi: lydo };
            if (JSON.stringify(old) !== JSON.stringify(newd)) {
              ThemLichSu({
                doing: "Sửa lý do",
                olddata: { old },
                newdata: { new: newd },
                tbl: "Phiếu xác đổi",
              });
            }
            hi.push("/quan-ly/phong");
            hi.push("/quan-ly/phong/phieu-xac-nhan");
          }
        } else if (type === "hp") {
          const res = await DoiHuyFinder.put("/sua-ly-do-huy", {
            id: id,
            lydohuy: lydo,
          });
          if (res.data.status === "ok") {
            const newd = { id: id, lydohuy: lydo };
            if (JSON.stringify(old) !== JSON.stringify(newd)) {
              ThemLichSu({
                doing: "Sửa lý do",
                olddata: { old },
                newdata: { new: newd },
                tbl: "Phiếu xác nhận hủy",
              });
            }
            hi.push("/quan-ly/phong");
            hi.push("/quan-ly/phong/phieu-xac-nhan");
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <button
        className="btn btn-warning mr-2"
        type="button"
        data-target={`#id${id}${type}phong`}
        data-toggle="modal"
        onClick={onClick}
      >
        Sửa
      </button>
      <div className="modal fade mb-5" id={`id${id}${type}phong`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sửa lý do</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor={`sualydo${type}`}></label>{" "}
                <textarea
                  id={`sualydo${type}`}
                  rows="3"
                  className="form-control"
                  value={lydo}
                  onChange={(e) => setLydo(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-warning font-weight-bold mr-2 px-4"
                data-dismiss="modal"
                onClick={(e) => handleUpdate(e)}
              >
                Sửa
              </button>
              <button
                type="button"
                className="btn btn-secondary font-weight-bold ml-2"
                data-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuaPhieuXacNhan;
