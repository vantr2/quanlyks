import React, { useEffect, useState } from "react";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import DonViTinhFinder from "../../../apis/DonViTinhFinder";
import NormalizeString from "../../../utils/NormalizeString";
import { useParams, useHistory } from "react-router";
import CreatableSelect from "react-select/creatable";
import { convertDataTocreatableSelect } from "../../../utils/DataHandler";
import CurrencyInput from "react-currency-input-field";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThemPhieuMuaChiTiet = () => {
  const { id } = useParams();
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

  const [msgError, setMsgError] = useState("");

  let hi = useHistory();
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

  useEffect(() => {
    const filterNhaCC = async () => {
      try {
        const res = await NhaCungCapFinder.get("/danh-sach-nha-cung-cap");
        setNhaCCFilter(res.data.data.nhacungcap);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterNhaCC();
    getLoaiHangHoa();
    getDonViTinh();
  }, [setNhaCCFilter, setLoaiHH, setDonViTinh]);

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
      ThemLichSu({
        doing: "Thêm",
        olddata: {},
        newdata: { new: res.data.data.donvitinh },
        tbl: "Đơn vị tính",
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
      ThemLichSu({
        doing: "Thêm",
        olddata: {},
        newdata: { new: res.data.data.loaihh },
        tbl: "Loại hàng hóa",
      });
      setLoaiHhId(res.data.data.loaihh.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!tenhh) {
      setMsgError("Tên hàng hóa không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!dongia) {
      setMsgError("Đơn giá không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (/-/.test(dongia)) {
      setMsgError("Đơn giá không được âm.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!dvtId) {
      setMsgError("Đơn vị tính không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (/-/.test(soluong + "")) {
      setMsgError("Số lượng không được âm.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!loaihhId) {
      setMsgError("Loại tài sản không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (nhacc === "--Chọn--") {
      setMsgError("Nhà cung cấp không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!ghichu) {
      setMsgError("Ghi chú không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await PhieuMuaFinder.post("/them-chi-tiet", {
          ten: NormalizeString(tenhh),
          dongia: dongia,
          soluong: soluong,
          thanhtien: parseInt(dongia) * parseInt(soluong),
          ghichu: ghichu,
          phieumua_id: id,
          donvitinh: dvtId,
          loaihang_id: loaihhId,
          nhacc_id: nhacc,
        });
        if (res.data.status === "ok") {
          ThemLichSu({
            doing: "Thêm",
            olddata: {},
            newdata: { new: res.data.data.phieumua_chitiet },
            tbl: "Hàng hóa trong phiếu mua",
          });
          hi.push("/quan-ly/ql-hang-hoa/phieu-mua");
          hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${id}`);
        } else {
          setMsgError(res.data.status);
          setTimeout(() => {
            setMsgError("");
          }, 3000);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="themphieumuachitiet">
          <div className="card">
            <div className="card-header" id="pmchitietcard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthemphieumuachitiet"
                  aria-expanded="false"
                  aria-controls="formthemphieumuachitiet"
                  style={{ cursor: "pointer" }}
                >
                  Thêm hàng hóa
                </div>
              </h5>
            </div>
            <div
              id="formthemphieumuachitiet"
              className="collapse"
              aria-labelledby="pmchitietcard"
              data-parent="#themphieumuachitiet"
            >
              <div className="card-body px-5">
                <form action="" encType="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="tenhanghoa">Tên hàng hóa</label>
                    <input
                      type="text"
                      id="tenhanghoa"
                      className="form-control"
                      value={tenhh}
                      onChange={(e) => setTenHh(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="dongia">Đơn giá</label>
                        <CurrencyInput
                          id="dongia"
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
                        <label htmlFor="donvitinh">Đơn vị tính</label>
                        <CreatableSelect
                          id="donvitinh"
                          isClearable
                          onChange={handleChangeDonViTinh}
                          options={donvitinh}
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="soluong">Số lượng</label>
                        <input
                          type="number"
                          id="soluong"
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
                        <label htmlFor="loaihanghoa">Loại hàng hóa</label>
                        <CreatableSelect
                          id="loaihanghoa"
                          isClearable
                          onChange={handleChangeLoaiHangHoa}
                          options={loaiHH}
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="nhacc">Nhà cung cấp</label>
                        <select
                          onChange={(e) => setNhaCC(e.target.value)}
                          value={nhacc}
                          id="nhacc"
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
                    <label htmlFor="ghichu">Ghi chú</label>
                    <textarea
                      id="ghichu"
                      rows="6"
                      className="form-control"
                      value={ghichu}
                      onChange={(e) => setGhiChu(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary py-2 px-4"
                    onClick={handleSubmit}
                  >
                    Thêm
                  </button>
                  <p className="text-danger my-2">{msgError}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemPhieuMuaChiTiet;
