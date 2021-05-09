import React, { useState } from "react";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { useHistory } from "react-router";
import CurrencyInput from "react-currency-input-field";

const SuaTaiSanBaoDuong = ({ id, bdId }) => {
  const [phibd, setPhiBd] = useState("");
  const [ghichu, setGhiChu] = useState("");

  let hi = useHistory();
  const fetchData = async () => {
    try {
      const res = await BaoDuongFinder.get(`/chi-tiet-theo-id/${id}`);
      if (res.data.status === "ok") {
        const bdChiTietSelected = res.data.data.baoduong_chitiet;
        setGhiChu(bdChiTietSelected.ghichu);
        setPhiBd(bdChiTietSelected.phibd);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleUpdate = async (e) => {
    e.stopPropagation();

    try {
      const res = await BaoDuongFinder.put("sua-chi-tiet", {
        id: id,
        phibd: phibd,
        ghichu: ghichu,
      });
      if (res.data.status === "ok") {
        hi.push("/quan-ly/ql-tai-san/bao-duong");
        hi.push(`/quan-ly/ql-tai-san/bao-duong/${bdId}`);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <i
        className="fas fa-pencil-alt p-1 text-primary"
        data-toggle="modal"
        data-target={`#id${id}sua`}
        onClick={fetchData}
      ></i>

      <div className="modal fade mb-5" id={`id${id}sua`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sửa thông tin bảo dưỡng chi tiết</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor={`phibd${id}`}>Phí bảo dưỡng</label>
                <CurrencyInput
                  id={`phibd${id}`}
                  value={phibd}
                  className="form-control text-right"
                  suffix=" đồng"
                  groupSeparator="."
                  onValueChange={(value) => {
                    setPhiBd(value);
                  }}
                  step="1000"
                  maxLength="9"
                />
              </div>
              <div className="form-group">
                <label htmlFor={`ghichu${id}`}>Ghi chú</label>
                <textarea
                  className="form-control"
                  id={`ghichu${id}`}
                  rows="2"
                  value={ghichu}
                  onChange={(e) => setGhiChu(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
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
                Không
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuaTaiSanBaoDuong;
