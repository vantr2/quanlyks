import React, { useState } from "react";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import DonViTinhFinder from "../../../apis/DonViTinhFinder";
import { useHistory } from "react-router";
import NormalizeString from "../../../utils/NormalizeString";
import { convertDataTocreatableSelect } from "../../../utils/DataHandler";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";

const SuaPhieuMuaChiTiet = ({ id, pmid }) => {
  let hi = useHistory();

  const [tenhh, setTenHh] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [dongia, setDonGia] = useState("");
  const [soluong, setSoLuong] = useState("1");
  const [loaihhId, setLoaiHhId] = useState("");
  const [dvtId, setDonViTinhId] = useState("");
  const [nhacc, setNhaCC] = useState("--Chọn--");

  const [nhaccFilter, setNhaCCFilter] = useState([]);
  const [loaiHH, setLoaiHH] = useState([]);
  const [donvitinh, setDonViTinh] = useState([]);

  const [loaiHHSelected, setLoaiHHSelected] = useState();
  const [donvitinhSelected, setDonViTinhSelected] = useState();

  const getLoaiHangHoa = async () => {
    try {
      const res = await PhieuMuaFinder.get("/danh-sach-loai-hang-hoa");
      setLoaiHH(convertDataTocreatableSelect(res.data.data.loaihh));
    } catch (err) {
      console.log(err.message);
    }
  };
  const getDonViTinh = async () => {
    try {
      const res = await DonViTinhFinder.get("/danh-sach-don-vi-tinh");
      setDonViTinh(convertDataTocreatableSelect(res.data.data.donvitinh));
    } catch (err) {
      console.log(err.message);
    }
  };

  const filterNhaCC = async () => {
    try {
      const res = await NhaCungCapFinder.get("/danh-sach-nha-cung-cap");
      setNhaCCFilter(res.data.data.nhacungcap);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchData = async () => {
    try {
      const res = await PhieuMuaFinder.get(`/chi-tiet-theo-id/${id}`);
      if (res.data.status === "ok") {
        const pmCtSelected = res.data.data.phieumua_chitiet;
        setTenHh(pmCtSelected.ten);
        setGhiChu(pmCtSelected.ghichu);
        setDonGia(pmCtSelected.dongia);
        setSoLuong(pmCtSelected.soluong);
        setLoaiHhId(pmCtSelected.loaihang_id);
        setNhaCC(pmCtSelected.nhacc_id);
        setDonViTinhId(pmCtSelected.donvitinh_id);

        setDonViTinhSelected({
          value: pmCtSelected.donvitinh_id,
          label: pmCtSelected.donvitinh_name,
        });
        setLoaiHHSelected({
          value: pmCtSelected.loaihang_id,
          label: pmCtSelected.loaihang_name,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "black" : "#51515",
      padding: 5,
    }),
  };

  const handleChangeDonViTinh = (dataSelected, actionMeta) => {
    if (actionMeta.action === "select-option") {
      setDonViTinhId(dataSelected.value);
    } else if (actionMeta.action === "create-option") {
      handleAddDonViTinh(dataSelected.value);
    } else if (actionMeta.action === "clear") {
      setDonViTinhId("");
    }
  };

  const handleAddDonViTinh = async (name) => {
    try {
      const res = await DonViTinhFinder.post("/them-don-vi-tinh", {
        name: name,
      });
      setDonViTinhId(res.data.data.donvitinh.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeLoaiHangHoa = (dataSelected, actionMeta) => {
    if (actionMeta.action === "select-option") {
      setLoaiHhId(dataSelected.value);
    } else if (actionMeta.action === "create-option") {
      handleAddLoaiHangHoa(dataSelected.value);
    } else if (actionMeta.action === "clear") {
      setLoaiHhId("");
    }
  };

  const handleAddLoaiHangHoa = async (name) => {
    try {
      const res = await PhieuMuaFinder.post("/them-loai-hang-hoa", {
        name: name,
      });
      setLoaiHhId(res.data.data.loaihh.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleClickUpdate = () => {
    fetchData();
    filterNhaCC();
    getDonViTinh();
    getLoaiHangHoa();
  };

  const handleUpdate = async (e) => {
    e.stopPropagation();
    try {
      const res = await PhieuMuaFinder.put("/sua-chi-tiet", {
        id: id,
        ten: NormalizeString(tenhh),
        dongia: dongia,
        soluong: soluong,
        thanhtien: parseInt(dongia) * parseInt(soluong),
        ghichu: ghichu,
        donvitinh: dvtId,
        loaihang_id: loaihhId,
        nhacc_id: nhacc,
      });
      if (res.data.status === "ok") {
        hi.push("/quan-ly/ql-hang-hoa/phieu-mua");
        hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${pmid}`);
      }
      //   console.log(
      //     id,
      //     NormalizeString(tenhh),
      //     dongia,
      //     soluong,
      //     parseInt(dongia) * parseInt(soluong),
      //     ghichu,
      //     dvtId,
      //     loaihhId,
      //     nhacc
      //   );
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
        onClick={handleClickUpdate}
      ></i>

      <div className="modal fade mb-5" id={`id${id}sua`}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Sửa thông tin phiếu mua hàng chi tiết
              </h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor={`tenhanghoa${id}`}>Tên hàng hóa</label>
                <input
                  type="text"
                  id={`tenhanghoa${id}`}
                  className="form-control"
                  value={tenhh}
                  onChange={(e) => setTenHh(e.target.value)}
                />
              </div>
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    <label htmlFor={`dongia${id}`}>Đơn giá</label>
                    <CurrencyInput
                      id={`dongia${id}`}
                      value={dongia}
                      className="form-control text-right"
                      suffix=" đồng"
                      groupSeparator="."
                      onValueChange={(value) => {
                        setDonGia(value);
                      }}
                      step="1000"
                      maxLength="9"
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group ">
                    <label htmlFor={`donvitinh${id}`}>Đơn vị tính</label>
                    <CreatableSelect
                      id={`donvitinh${id}`}
                      isClearable
                      onChange={handleChangeDonViTinh}
                      options={donvitinh}
                      styles={customStyles}
                      value={donvitinhSelected}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor={`soluong${id}`}>Số lượng</label>
                    <input
                      type="number"
                      id={`soluong${id}`}
                      className="form-control"
                      value={soluong}
                      min="1"
                      max="1000"
                      onChange={(e) => setSoLuong(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="col">
                  <div className="form-group ">
                    <label htmlFor={`loaihanghoa${id}`}>Loại hàng hóa</label>
                    <CreatableSelect
                      id={`loaihanghoa${id}`}
                      isClearable
                      onChange={handleChangeLoaiHangHoa}
                      options={loaiHH}
                      styles={customStyles}
                      value={loaiHHSelected}
                    />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                    <label htmlFor={`nhacc${id}`}>Nhà cung cấp</label>
                    <select
                      onChange={(e) => setNhaCC(e.target.value)}
                      value={nhacc}
                      id={`nhacc${id}`}
                      className="form-control"
                    >
                      <option value="--Chọn--" disabled>
                        -- Chọn --
                      </option>
                      {nhaccFilter.map((nhacc) => {
                        return (
                          <option key={nhacc.id} value={nhacc.id}>
                            {nhacc.ten}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor={`ghichu${id}`}>Ghi chú</label>
                <textarea
                  id={`ghichu${id}`}
                  rows="6"
                  className="form-control"
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

export default SuaPhieuMuaChiTiet;
