import React, { useState } from "react";
import PhongFinder from "../../../../apis/PhongFinder";
import DoiHuyFinder from "../../../../apis/DoiHuyFinder";
import { NumberFormat } from "../../../../utils/DataHandler";
import { useHistory } from "react-router";
import DatPhongFinder from "../../../../apis/DatPhongFinder";
const DoiPhong = ({ phongid, dpid }) => {
  const [lydo, setLyDo] = useState("");
  const [phongden, setPhongDen] = useState("");
  const [giathue, setGiaThue] = useState("");
  const [kieuthue, setKieuThue] = useState("");

  const [dsPhong, setDsPhong] = useState([]);

  let hi = useHistory();
  const username = window.localStorage.getItem("user_name");

  const handleDoiPhong = async (e) => {
    e.stopPropagation();
    if (lydo && phongden) {
      try {
        const res = await DoiHuyFinder.post("/them-doi-phong", {
          tuphong: phongid,
          denphong: phongden,
          lydodoi: lydo,
          nguoidoi: username,
          datphong_id: dpid,
          giathue: giathue,
        });
        if (res.data.data.doiphong) {
          hi.push("/quan-ly/phong/tinh-trang");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  const handleClick = async () => {
    try {
      const res = await PhongFinder.get(`/danh-sach-phong-ss/${phongid}`);
      setDsPhong(res.data.data.phong);

      const res_dp = await DatPhongFinder.get(`/danh-sach-full/${dpid}`);
      setKieuThue(res_dp.data.data.datphong.kieuthue);
      setPhongDen("");
      setGiaThue("");
      setLyDo("");
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleChangePhongDen = async (e) => {
    setPhongDen(e.target.value);

    const res = await PhongFinder.get(`/danh-sach-phong/${e.target.value}`);
    if (res.data.data.phong) {
      //   console.log(res.data.data.phong);
      if (kieuthue === "Thuê theo ngày") {
        setGiaThue(res.data.data.phong.giaphongtheongay);
      } else {
        setGiaThue(res.data.data.phong.giaphongtheogio);
      }
    }
  };
  return (
    <div>
      <button
        className="btn btn-warning mt-3 ml-2"
        type="button"
        data-toggle="modal"
        data-target={`#id${phongid}doiphong`}
        onClick={handleClick}
      >
        Đổi phòng
      </button>

      <div className="modal fade mb-5" id={`id${phongid}doiphong`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận đổi phòng</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="phongden">Phòng muốn đổi</label>
                <select
                  id="phongden"
                  className="form-control"
                  value={phongden}
                  onChange={(e) => handleChangePhongDen(e)}
                >
                  <option value="" disabled>
                    --Chọn--
                  </option>
                  {dsPhong.map((phong) => {
                    return (
                      <option
                        value={phong.ten}
                        key={phong.ten}
                        className="form-control"
                      >
                        {phong.ten} - Giá phòng:{" "}
                        {NumberFormat(phong.giaphongtheongay)} VND/1 ngày,{" "}
                        {NumberFormat(phong.giaphongtheogio)} VND/ 1 giờ
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="lydodoi">Lý do đổi</label>
                <textarea
                  id="lydodoi"
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
                onClick={(e) => handleDoiPhong(e)}
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

export default DoiPhong;
