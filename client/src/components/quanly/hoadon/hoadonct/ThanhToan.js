import React from "react";
import DatPhongFinder from "../../../../apis/DatPhongFinder";
import HoaDonFinder from "../../../../apis/HoaDonFinder";
import PhongFinder from "../../../../apis/PhongFinder";
import { useHistory } from "react-router";
const ThanhToan = ({ id, dsdp }) => {
  let hi = useHistory();
  const handleThanhToan = async (e) => {
    e.stopPropagation();
    try {
      //   console.log(id);
      const res_hd = await HoaDonFinder.put("/update-tt", {
        id: id,
        trangthai: 1,
      });
      if (res_hd.data.status === "ok") {
        dsdp.forEach(async (item) => {
          const res_dp = await DatPhongFinder.get(
            `/danh-sach-full/${item.datphong_id}`
          );
          if (res_dp.data.status === "ok") {
            await DatPhongFinder.put("/update-tt", {
              id: res_dp.data.data.datphong.id,
              trangthai: 0,
            });
            await PhongFinder.put("/update-tt", {
              ten: res_dp.data.data.datphong.phong_id,
              trangthai: 0,
            });
          }
        });
        hi.push("/quan-ly/phong/hoa-don");
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-danger ml-2"
        data-toggle="modal"
        data-target={`#id${id}thanhtoan`}
      >
        Thanh toán
      </button>

      <div className="modal fade mb-5" id={`id${id}thanhtoan`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p>Bạn có thực sự muốn thanh toán</p>
            </div>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
                data-dismiss="modal"
                onClick={(e) => handleThanhToan(e)}
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

export default ThanhToan;
