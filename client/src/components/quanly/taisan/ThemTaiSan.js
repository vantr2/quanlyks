import React, { useContext, useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AccountContext } from "../../../contexts/AccountContext";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import PhongFinder from "../../../apis/PhongFinder";
import DonViTinhFinder from "../../../apis/DonViTinhFinder";
import NormalizeString from "../../../utils/NormalizeString";
import CreatableSelect from "react-select/creatable";
import { convertDataTocreatableSelect } from "../../../utils/DataHandler";
import CurrencyInput from "react-currency-input-field";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThemTaiSan = () => {
  const [tents, setTenTs] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [giataisan, setGiaTaiSan] = useState("");
  const [ngaymua, setNgayMua] = useState("");
  const [vitri, setViTri] = useState("--Chọn--");
  const [loaitsId, setLoaiTsId] = useState("");
  const [dvtId, setDonViTinhId] = useState("");
  const [nhacc, setNhaCC] = useState("--Chọn--");

  const [phongFilter, setPhongFilter] = useState([]);
  const [nhaccFilter, setNhaCCFilter] = useState([]);
  const [loaiTS, setLoaiTS] = useState([]);
  const [donvitinh, setDonViTinh] = useState([]);

  const { themTaiSan, setMsgTaiSanActionSuccess } = useContext(AccountContext);
  const [msgError, setMsgError] = useState("");

  const getLoaiTaiSan = async () => {
    try {
      const res = await TaiSanFinder.get("/danh-sach-loai-tai-san");
      setLoaiTS(convertDataTocreatableSelect(res.data.data.loaitaisan));
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

    const filterVitri = async () => {
      try {
        const res = await PhongFinder.get("/danh-sach-phong");
        setPhongFilter(res.data.data.phong);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterVitri();

    getLoaiTaiSan();

    getDonViTinh();
  }, [setPhongFilter, setNhaCCFilter, setLoaiTS, setDonViTinh]);

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
      ThemLichSu({
        doing: "Thêm",
        olddata: {},
        newdata: { new: res.data.data.donvitinh },
        tbl: "Đơn vị tính",
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeLoaiTaiSan = (dataSelected, actionMeta) => {
    if (actionMeta.action === "select-option") {
      setLoaiTsId(dataSelected.value);
    } else if (actionMeta.action === "create-option") {
      handleAddLoaiTaiSan(dataSelected.value);
    } else if (actionMeta.action === "clear") {
      setLoaiTsId("");
    }
  };

  const handleAddLoaiTaiSan = async (name) => {
    try {
      const res = await TaiSanFinder.post("/them-loai-tai-san", {
        name: name,
      });
      ThemLichSu({
        doing: "Thêm",
        olddata: {},
        newdata: { new: res.data.data.loaitaisan },
        tbl: "Loại tài sản",
      });
      setLoaiTsId(res.data.data.loaitaisan.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = async () => {
    if (!tents) {
      setMsgError("Tên tài sản không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!giataisan) {
      setMsgError("Giá tài sản không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (/-/.test(giataisan)) {
      setMsgError("Giá tài sản không được âm.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!ngaymua) {
      setMsgError("Ngày mua tài sản không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (vitri === "--Chọn--") {
      setMsgError("Vị trí tài sản không được để trống.");
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
    } else if (!loaitsId) {
      setMsgError("Loại tài sản không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!dvtId) {
      setMsgError("Đơn vị tính không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await TaiSanFinder.post("/them-tai-san", {
          ten: NormalizeString(tents),
          ghichu: ghichu,
          giataisan: giataisan,
          ngaymua: ngaymua,
          trangthai: 1,
          vitri: vitri,
          bdlancuoi: ngaymua,
          dvt_id: dvtId,
          nhacc_id: nhacc,
          loaitaisan_id: loaitsId,
        });

        if (res.data.status === "ok") {
          ThemLichSu({
            doing: "Thêm",
            olddata: {},
            newdata: { new: res.data.data.taisan },
            tbl: "Tài sản",
          });
          themTaiSan(res.data.data.taisan);
          setMsgTaiSanActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgTaiSanActionSuccess("");
          }, 2500);
          setTenTs("");
          setGiaTaiSan("");
          setNgayMua("");
          setViTri("--Chọn--");
          setNhaCC("--Chọn--");
          setGhiChu("");
          getDonViTinh();
          getLoaiTaiSan();
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="themtaisan">
          <div className="card">
            <div className="card-header" id="taisancard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthemtaisan"
                  aria-expanded="false"
                  aria-controls="formthemtaisan"
                  style={{ cursor: "pointer" }}
                >
                  Thêm tài sản
                </div>
              </h5>
            </div>
            <div
              id="formthemtaisan"
              className="collapse"
              aria-labelledby="taisancard"
              data-parent="#themtaisan"
            >
              <div className="card-body px-5">
                <form action="" encType="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="tentaisan">Tên tài sản</label>
                    <input
                      type="text"
                      id="tentaisan"
                      className="form-control"
                      value={tents}
                      onChange={(e) => setTenTs(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="giats">Giá tài sản</label>
                        {/* <input
                          type="number"
                          min="10000"
                          step="1000"
                          id="giadv"
                          className="form-control text-right"
                          value={giataisan}
                          onChange={(e) => setGiaTaiSan(e.target.value)}
                        /> */}
                        <CurrencyInput
                          id="giats"
                          value={giataisan}
                          className="form-control text-right"
                          suffix=" đồng"
                          groupSeparator="."
                          onValueChange={(value) => {
                            setGiaTaiSan(value);
                          }}
                          step="1000"
                          maxLength="9"
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="ngaymua">Ngày mua</label>
                        <input
                          type="date"
                          id="ngaymua"
                          className="form-control"
                          onChange={(e) => setNgayMua(e.target.value)}
                          value={ngaymua}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="vitritaisan">Vị trí tài sản</label>
                        <select
                          onChange={(e) => setViTri(e.target.value)}
                          value={vitri}
                          id="vitritaisan"
                          className="form-control"
                        >
                          <option value="--Chọn--" disabled>
                            -- Chọn --
                          </option>
                          {phongFilter.map((phong) => {
                            return (
                              <option key={phong.ten} value={phong.ten}>
                                {phong.ten}
                              </option>
                            );
                          })}
                        </select>
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
                    <CKEditor
                      data={ghichu}
                      editor={ClassicEditor}
                      onChange={(event, editor) => {
                        const data = editor.getData();
                        setGhiChu(data);
                      }}
                      // config={{
                      //   ckfinder: {
                      //     uploadUrl: "http://localhost:3005/api/v1/phong/uploads",
                      //   },
                      //
                    />
                  </div>

                  <div className="form-row">
                    <div className="col">
                      <div className="form-group ">
                        <label htmlFor="loaitaisan">Loại tài sản</label>
                        <CreatableSelect
                          id="loaitaisan"
                          isClearable
                          onChange={handleChangeLoaiTaiSan}
                          options={loaiTS}
                          styles={customStyles}
                        />
                      </div>
                    </div>
                    <div className="col">
                      {" "}
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

export default ThemTaiSan;
