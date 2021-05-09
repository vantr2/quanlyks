import React, { useContext, useState } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { useHistory } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";

const SuaThongTinNguoiDung = ({ nguoidung }) => {
  let hi = useHistory();
  const [tenHT, setTenHT] = useState(nguoidung.ten_hienthi);
  const [vaitro, setVaiTro] = useState(nguoidung.vaitro);

  const { setMsgUserActionSuccess } = useContext(AccountContext);
  const handleUpdate = async (e) => {
    try {
      await TaiKhoanFinder.put("/cap-nhat-thong-tin-nguoi-dung", {
        ten: nguoidung.ten,
        tenht: tenHT,
        vaitro: vaitro,
      });
      setMsgUserActionSuccess("Sửa thành công");
      setTimeout(() => {
        setMsgUserActionSuccess("");
      }, 1800);
      hi.push("/quan-ly");
      hi.push("/quan-ly/admin/tai-khoan");
    } catch (err) {
      console.log(err.message);
    }
  };

  const getData = () => {
    setTenHT(nguoidung.ten_hienthi);
    setVaiTro(nguoidung.vaitro);
  };
  return (
    <div>
      <button
        className="btn btn-info"
        data-toggle="modal"
        data-target={`#id${nguoidung.ten}`}
        onClick={getData}
      >
        Sửa
      </button>
      <div className="modal " id={`id${nguoidung.ten}`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sửa thông tin người dùng</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body text-left">
              <div className="form-group mx-4">
                <label htmlFor={`ten_hienthi_${nguoidung.ten}`}>
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  id={`ten_hienthi_${nguoidung.ten}`}
                  className="form-control"
                  onChange={(e) => setTenHT(e.target.value)}
                  value={tenHT}
                />
              </div>

              <div className="form-group mx-4">
                <label htmlFor={`vaitro_${nguoidung.ten}`}>Vai trò</label>
                <select
                  className="form-control"
                  id={`vaitro_${nguoidung.ten}`}
                  onChange={(e) => setVaiTro(e.target.value)}
                  value={vaitro}
                >
                  <option value="NVLT">Nhân viên lễ tân</option>
                  <option value="QL">Nhân viên quản lý</option>
                  <option value="NVK">Nhân viên thu chi</option>
                  <option value="NVDP">Nhân viên dọn phòng</option>
                  <option value="KH">Khách hàng</option>
                </select>
              </div>
            </div>

            <div className="modal-footer  justify-content-center">
              <button
                type="button"
                className="btn btn-info font-weight-bold mr-2"
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

export default SuaThongTinNguoiDung;
