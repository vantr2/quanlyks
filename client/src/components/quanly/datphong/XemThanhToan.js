import React, { useState } from "react";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import { NumberFormat } from "../../../utils/DataHandler";

const XemThanhToan = ({ phongid }) => {
  const [dpSelected, setDpSelected] = useState([]);
  const handleClick = async (e) => {
    try {
      const res = await DatPhongFinder.get(`/danh-sach/${phongid}`);
      if (res.data.status === "ok") {
        setDpSelected(res.data.data.datphong);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <button
        type="button"
        className="btn btn-primary mx-3 py-2"
        data-toggle="modal"
        data-target={`#id${phongid}xemtt`}
        onClick={handleClick}
      >
        Xem thanh toán
      </button>

      <div className="modal fade mb-5" id={`id${phongid}xemtt`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Tổng tiền trước thuế và phạt</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p>
                Tiền SD dịch vụ:{" "}
                <strong>{NumberFormat(dpSelected.tongtien)} </strong>VND
              </p>
              <p>
                Tiền phòng:{" "}
                <strong>
                  {NumberFormat(
                    parseInt(dpSelected.giathue) * parseInt(dpSelected.sotgthue)
                  )}{" "}
                </strong>
                VND
              </p>
            </div>

            <div className="modal-footer justify-content-start">
              <p>
                Tổng cộng:{" "}
                <strong>
                  {NumberFormat(
                    parseInt(dpSelected.giathue) *
                      parseInt(dpSelected.sotgthue) +
                      parseInt(dpSelected.tongtien)
                  )}
                </strong>{" "}
                VND
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XemThanhToan;
