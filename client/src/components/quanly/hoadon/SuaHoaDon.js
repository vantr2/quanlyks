import React, { useState } from "react";
import CurrencyInput from "react-currency-input-field";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { useHistory } from "react-router";
import ThemLichSu from "../../../utils/ThemLichSu";
const SuaHoaDon = ({ id }) => {
  let hi = useHistory();
  const [nvId, setNvId] = useState("");
  const [vat, setVat] = useState("10");
  const [hinhthuctt, setHinhThucTT] = useState("1");
  const [chietkhautong, setChietKhauTong] = useState("");
  const [dsNhanVien, setDsNhanVien] = useState([]);

  const [old, setOld] = useState({});
  const fetchData = async () => {
    try {
      const res = await NhanVienFinder.get("/danh-sach-nhan-vien");
      setDsNhanVien(res.data.data.nhanvien);

      const res_hd = await HoaDonFinder.get(`/danh-sach/${id}`);
      const hdSelected = res_hd.data.data.hoadon;
      setNvId(hdSelected.nv_id);
      setVat(hdSelected.vat);
      setHinhThucTT(hdSelected.hinhthuctt);
      setChietKhauTong(hdSelected.chietkhautong);
      setOld({
        id: id,
        nv: hdSelected.nv_id,
        hinhthuctt: hdSelected.hinhthuctt,
        vat: hdSelected.vat,
        chietkhautong: hdSelected.chietkhautong,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleUpdate = async (e) => {
    e.stopPropagation();
    try {
      if (vat) {
        const res = await HoaDonFinder.put("/sua", {
          id: id,
          nv: nvId,
          hinhthuctt: hinhthuctt,
          vat: vat,
          chietkhautong: chietkhautong,
        });
        if (res.data.status === "ok") {
          const newd = {
            id: id,
            nv: nvId,
            hinhthuctt: hinhthuctt,
            vat: vat,
            chietkhautong: chietkhautong,
          };
          if (JSON.stringify(old) !== JSON.stringify(newd)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old },
              newdata: { new: newd },
              tbl: "Hóa đơn",
            });
          }
          hi.push("/quan-ly/phong");
          hi.push("/quan-ly/phong/hoa-don");
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <i
        className="fas fa-trash text-warning"
        data-toggle="modal"
        data-target={`#id${id}suahoadon`}
        onClick={fetchData}
      >
        &nbsp;Sửa
      </i>

      <div className="modal fade mb-5" id={`id${id}suahoadon`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Sửa thông tin hóa đơn</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body ">
              <div className="input-group-prepend form-group">
                <label className="input-group-text" htmlFor={`dsnhanvien${id}`}>
                  Người lập phiếu
                </label>
                <select
                  id={`dsnhanvien${id}`}
                  value={nvId}
                  className="custom-select"
                  onChange={(e) => setNvId(e.target.value)}
                >
                  <option value="" disabled>
                    --Chọn--
                  </option>
                  {dsNhanVien.map((nv) => {
                    return (
                      <option value={nv.id} key={nv.id}>
                        {nv.name} - {nv.sdt} - {nv.account}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <div className="form-group">
                  <label htmlFor={`hinhthuctt${id}`}>
                    Hình thức thanh toán
                  </label>
                  <select
                    type="text"
                    className="form-control"
                    value={hinhthuctt}
                    id={`hinhthuctt${id}`}
                    onChange={(e) => setHinhThucTT(e.target.value)}
                  >
                    <option value="1">Tiền mặt</option>
                    <option value="2">Chuyển khoản</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor={`vat${id}`} className="modal-text">
                      Thuế giá trị gia tăng (%)
                    </label>
                    <CurrencyInput
                      id={`vat${id}`}
                      value={vat}
                      decimalSeparator=","
                      precision="2"
                      className="form-control text-right"
                      suffix=" %"
                      onValueChange={(value) => {
                        setVat(value);
                      }}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor={`chietkhau${id}`} className="modal-text">
                      Chiết khấu
                    </label>
                    <CurrencyInput
                      id={`chietkhau${id}`}
                      value={chietkhautong}
                      decimalSeparator=","
                      precision="2"
                      className="form-control text-right"
                      suffix=" đ"
                      onValueChange={(value) => {
                        setChietKhauTong(value);
                      }}
                    />
                  </div>
                </div>
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

export default SuaHoaDon;
