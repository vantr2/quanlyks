import React, { useContext, useState } from "react";

import { useHistory } from "react-router";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import NormalizeString from "../../../utils/NormalizeString";
const SuaNcc = ({ id }) => {
  const [tenncc, setTenNcc] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [sdt, setSdt] = useState("");
  let hi = useHistory();
  const { setMsgNccActionSuccess } = useContext(AccountContext);

  const handleSelected = async () => {
    try {
      const res = await NhaCungCapFinder.get(`/danh-sach/${id}`);
      if (res.data.status === "ok") {
        const nccSelected = res.data.data.nhacungcap;
        setTenNcc(nccSelected.ten);
        setDiaChi(nccSelected.diachi);
        setSdt(nccSelected.sdt);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleUpdate = async (e) => {
    e.stopPropagation();

    try {
      const res = await NhaCungCapFinder.put("/sua", {
        id: id,
        ten: NormalizeString(tenncc),
        diachi: diachi,
        sdt: sdt,
      });
      if (res.data.status === "ok") {
        setMsgNccActionSuccess("Sửa thành công.");
        setTimeout(() => {
          setMsgNccActionSuccess("");
        }, 2500);
        hi.push("/quan-ly");
        hi.push("/quan-ly/danh-muc/nha-cung-cap");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div>
      <i
        className="fas fa-trash text-info"
        data-toggle="modal"
        data-target={`#id${id}sua`}
        onClick={handleSelected}
      >
        &nbsp;Sửa
      </i>

      <div className="modal fade mb-5" id={`id${id}sua`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sửa thông tin nhà cung cấp</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body text-left">
              <div className="form-group mx-4">
                <label htmlFor={`tennccsua${id}`} className="text-left">
                  Tên nhà cung cấp
                </label>
                <input
                  type="text"
                  id={`tennccsua${id}`}
                  className="form-control"
                  value={tenncc}
                  onChange={(e) => setTenNcc(e.target.value)}
                />
              </div>
              <div className="form-group mx-4">
                <label htmlFor={`sdtsua${id}`} className="text-left">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="form-control"
                  id={`sdtsua${id}`}
                  onChange={(e) => setSdt(e.target.value)}
                  value={sdt}
                />
              </div>
              <div className="form-group mx-4">
                <label htmlFor={`diachisua${id}`} className="text-left">
                  Địa chỉ
                </label>
                <textarea
                  className="form-control"
                  id={`diachisua${id}`}
                  rows="2"
                  value={diachi}
                  onChange={(e) => setDiaChi(e.target.value)}
                ></textarea>
              </div>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-info font-weight-bold mr-2 px-4"
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

export default SuaNcc;
