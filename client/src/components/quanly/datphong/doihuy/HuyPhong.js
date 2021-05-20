import React, { useState } from "react";
import DoiHuyFinder from "../../../../apis/DoiHuyFinder";

const HuyPhong = ({ phongid, dpid, tiencoc }) => {
  const [lydo, setLyDo] = useState("");

  const username = window.localStorage.getItem("user_name");
  const handleHuyPhong = async (e) => {
    e.stopPropagation();

    if (lydo) {
      try {
        const res = await DoiHuyFinder.post("/them-huy-phong", {
          phonghuy: phongid,
          lydohuy: lydo,
          nguoihuy: username,
          datphong_id: dpid,
          tiencoc: tiencoc,
        });
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <button
        className="btn btn-danger mt-3 ml-2"
        type="button"
        data-toggle="modal"
        data-target={`#id${phongid}huyphong`}
      >
        Hủy phòng
      </button>
      <div className="modal fade mb-5" id={`id${phongid}huyphong`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận hủy phòng</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="lydohuy">Lý do hủy</label>
                <textarea
                  id="lydohuy"
                  rows="3"
                  className="form-control"
                  value={lydo}
                  onChange={(e) => setLyDo(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
                data-dismiss="modal"
                onClick={(e) => handleHuyPhong(e)}
              >
                OK
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

export default HuyPhong;
