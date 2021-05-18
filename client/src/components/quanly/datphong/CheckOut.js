import React, { useState } from "react";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import PhongFinder from "../../../apis/PhongFinder";
import { useHistory } from "react-router";
const CheckOut = ({ phongid }) => {
  const [dpSelected, setDpSelected] = useState([]);
  let hi = useHistory();
  const handleClick = async () => {
    try {
      const res = await DatPhongFinder.get(`/danh-sach/${phongid}`);
      if (res.data.status === "ok") {
        setDpSelected(res.data.data.datphong);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleCheckOut = async () => {
    try {
      await DatPhongFinder.put("/check-out", {
        id: dpSelected.id,
      });

      await PhongFinder.put("/update-tt", {
        ten: phongid,
        trangthai: 3,
      });

      hi.push("/quan-ly/phong/tinh-trang");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-danger px-5 py-2"
        data-toggle="modal"
        data-target={`#id${phongid}checkout`}
        onClick={handleClick}
      >
        Check Out
      </button>

      <div className="modal fade mb-5" id={`id${phongid}checkout`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="text-left">Khách hàng đến checkout đúng không?</p>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-3"
                data-dismiss="modal"
                onClick={(e) => handleCheckOut(e)}
              >
                Đúng
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

export default CheckOut;
