import React, { useContext, useEffect, useState } from "react";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import PhongFinder from "../../../apis/PhongFinder";
import DonViTinhFinder from "../../../apis/DonViTinhFinder";
import { useHistory, useParams } from "react-router";
import NormalizeString from "../../../utils/NormalizeString";
import { AccountContext } from "../../../contexts/AccountContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {
  convertDataTocreatableSelect,
  convertDate,
} from "../../../utils/DataHandler";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";
import ThemLichSu from "../../../utils/ThemLichSu";

const SuaTaiSan = () => {
  let hi = useHistory();
  const { id } = useParams();

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
  const [loaiTSSelected, setLoaiTSSelected] = useState();
  const [donvitinhSelected, setDonViTinhSelected] = useState();

  const [loaiTS, setLoaiTS] = useState([]);
  const [donvitinh, setDonViTinh] = useState([]);

  const { setMsgTaiSanActionSuccess } = useContext(AccountContext);
  const [msgError, setMsgError] = useState("");
  const [old, setOld] = useState({});

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
    const fetchData = async () => {
      try {
        const res = await TaiSanFinder.get(`/danh-sach-tai-san/${id}`);
        const taisanSelected = res.data.data.taisan;
        setTenTs(taisanSelected.ten);
        setGhiChu(taisanSelected.ghichu);
        setGiaTaiSan(taisanSelected.giataisan);
        setNgayMua(convertDate(taisanSelected.ngaymua));
        setViTri(taisanSelected.vitri);
        setLoaiTsId(taisanSelected.loaitaisan_id);
        setNhaCC(taisanSelected.nhacc_id);
        setDonViTinhId(taisanSelected.donvitinh);

        setDonViTinhSelected({
          value: taisanSelected.donvitinh,
          label: taisanSelected.donvitinh_name,
        });
        setLoaiTSSelected({
          value: taisanSelected.loaitaisan_id,
          label: taisanSelected.loaitaisan_name,
        });

        setOld({
          id: id,
          ten: taisanSelected.ten,
          ghichu: taisanSelected.ghichu,
          giataisan: taisanSelected.giataisan,
          ngaymua: convertDate(taisanSelected.ngaymua),
          trangthai: taisanSelected.trangthai,
          vitri: taisanSelected.vitri,
          bdlancuoi: convertDate(taisanSelected.ngaymua),
          dvt_id: taisanSelected.donvitinh,
          nhacc_id: taisanSelected.nhacc_id,
          loaitaisan_id: taisanSelected.loaitaisan_id,
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
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
  }, [setPhongFilter, setNhaCCFilter, setLoaiTS, setDonViTinh, id]);

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
      setDonViTinhSelected(dataSelected);
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

  const handleChangeLoaiTaiSan = (dataSelected, actionMeta) => {
    if (actionMeta.action === "select-option") {
      setLoaiTsId(dataSelected.value);
      setLoaiTSSelected(dataSelected);
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
      setLoaiTsId(res.data.data.loaitaisan.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const goBack = () => {
    hi.push(`/quan-ly/ql-tai-san/thong-tin/${id}`);
  };

  const handleUpdate = async () => {
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
        const res = await TaiSanFinder.put("/sua-tai-san", {
          id: id,
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
          const newd = {
            id: id,
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
          };

          console.log(JSON.stringify(old) !== JSON.stringify(newd));
          if (JSON.stringify(old) !== JSON.stringify(newd)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old: old },
              newdata: { new: newd },
              tbl: "Tài sản",
            });
          }
          setMsgTaiSanActionSuccess("Sửa thành công.");
          setTimeout(() => {
            setMsgTaiSanActionSuccess("");
          }, 2500);
          hi.push(`/quan-ly/ql-tai-san/thong-tin/${id}`);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div>
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
                value={loaiTSSelected}
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
                value={donvitinhSelected}
              />
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

        <p className="text-danger my-2">{msgError}</p>

        <div className="d-flex flex-row">
          <button
            className="btn btn-warning px-4"
            type="button"
            onClick={handleUpdate}
          >
            Sửa
          </button>
          <button className="btn btn-primary ml-3" onClick={goBack}>
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuaTaiSan;
