import React, { useEffect, useState } from "react";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import { useHistory } from "react-router";
import NhanVienFinder from "../../../apis/NhanVienFinder";
const HanhDongDuyet = ({ hd, id }) => {
  let hi = useHistory();
  const [ghichu, setGhiChu] = useState();
  const [tennv, setTenNv] = useState();
  const username = window.localStorage.getItem("user_name");

  useEffect(() => {
    const getNhanVien = async () => {
      try {
        const res = await NhanVienFinder.get(
          `/danh-sach-nhan-vien-theo-acc/${username}`
        );
        setTenNv(res.data.data.nhanvien.name);
      } catch (err) {
        console.log(err.message);
      }
    };
    getNhanVien();
  }, [username]);
  const handleConfirm = async () => {
    try {
      await XinNghiFinder.put("ql-duyet", {
        id: id,
        trangthai: hd === "dy" ? 1 : 2,
        nguoiduyet: tennv,
        ph_nguoiduyet: ghichu ? ghichu : "Không có lời nhắn",
      });
      hi.push("/quan-ly");
      hi.push("/quan-ly/nv-quan-ly/duyet-don");
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <button
        type="button"
        className={hd === "dy" ? "btn btn-success mr-2" : "btn btn-danger ml-2"}
        data-toggle="modal"
        data-target={`#id${id}${hd}`}
      >
        &nbsp;{hd === "dy" ? "Đồng ý" : "Từ chối"}
      </button>

      <div className="modal fade mb-5" id={`id${id}${hd}`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Ghi chú</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <textarea
                rows="3"
                value={ghichu}
                onChange={(e) => setGhiChu(e.target.value)}
                className="form-control"
              ></textarea>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
                data-dismiss="modal"
                onClick={(e) => handleConfirm(e)}
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

export default HanhDongDuyet;
