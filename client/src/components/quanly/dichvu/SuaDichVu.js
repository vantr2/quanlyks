import React, { useContext, useEffect, useState } from "react";
import DichVuFinder from "../../../apis/DichVuFinder";
import { useHistory, useParams } from "react-router";
import NormalizeString from "../../../utils/NormalizeString";
import { AccountContext } from "../../../contexts/AccountContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { storage } from "../../../firebase";
import { convertDataTocreatableSelect } from "../../../utils/DataHandler";
import CreatableSelect from "react-select/creatable";
import CurrencyInput from "react-currency-input-field";
import ThemLichSu from "../../../utils/ThemLichSu";
const SuaDichVu = () => {
  let hi = useHistory();
  const { id } = useParams();

  const [old, setOld] = useState("");
  const [tendv, setTenDV] = useState("");
  const [anhDV, setAnhDV] = useState("");
  const [filename, setFileName] = useState("");
  const [giadichvu, setGiaDichVu] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [loai, setLoai] = useState();
  const [trangthai, setTrangThai] = useState("");

  const [loadDv, setLoadDv] = useState();
  const [msgError, setMsgError] = useState("");

  const [loaiDv, setLoaiDv] = useState([]);

  const { setMsgDichVuActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DichVuFinder.get(`/danh-sach-dich-vu/${id}`);
        const dichvuUpdate = res.data.data.dichvu;
        setTenDV(dichvuUpdate.ten);
        setAnhDV(dichvuUpdate.anhminhhoa);
        setFileName(dichvuUpdate.filename);
        setGiaDichVu(dichvuUpdate.giahientai);
        setGhiChu(dichvuUpdate.ghichu);
        setTrangThai(dichvuUpdate.trangthai);
        setLoai(dichvuUpdate.value);
        setLoadDv({ value: dichvuUpdate.value, label: dichvuUpdate.label });

        setOld({
          id: id,
          ten: dichvuUpdate.ten,
          ghichu: dichvuUpdate.ghichu,
          giadv: dichvuUpdate.giahientai,
          trangthai: dichvuUpdate.trangthai,
          anh: dichvuUpdate.anhminhhoa,
          filename: dichvuUpdate.filename,
          loaidichvu_id: dichvuUpdate.value,
        });
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();

    const getDataCategory = async () => {
      try {
        const res = await DichVuFinder.get("/danh-sach-loai-dich-vu");
        setLoaiDv(convertDataTocreatableSelect(res.data.data.loaidv));
      } catch (err) {
        console.log(err.message);
      }
    };
    getDataCategory();
  }, [id, setLoaiDv]);

  const handleDeleteImagePrev = () => {
    storage.ref("dichvu").child(filename).delete();
  };

  const goBack = () => {
    hi.push(`/quan-ly/danh-muc/dich-vu/${id}`);
  };

  const handleChange = (dataSelected, actionMeta) => {
    if (actionMeta.action === "select-option") {
      setLoai(dataSelected.value);
    } else if (actionMeta.action === "create-option") {
      handleAddCategory(dataSelected.value);
    }
  };

  const handleAddCategory = async (name) => {
    try {
      const res = await DichVuFinder.post("/them-loai-dich-vu", {
        name: name,
      });
      setLoai(res.data.data.loaidichvu.id);
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleUpload = (img) => {
    const uploadTask = storage.ref(`dichvu/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("dichvu")
          .child(img.name)
          .getDownloadURL()
          .then((url) => {
            setAnhDV(url);
          });
      }
    );
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      borderBottom: "1px dotted black",
      color: state.isSelected ? "black" : "#51515",
      padding: 5,
    }),
  };

  const handleUpdate = async () => {
    if (!tendv) {
      setMsgError("Tên dịch vụ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!giadichvu) {
      setMsgError("Giá dịch vụ theo ngày không được để trống.");
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
        const res = await DichVuFinder.put("/sua-dich-vu", {
          id: id,
          ten: NormalizeString(tendv),
          ghichu: ghichu,
          giadv: giadichvu,
          trangthai: trangthai,
          anh: anhDV,
          filename: filename,
          loaidichvu_id: loai,
        });
        // console.log(res);
        if (res.data.status === "ok") {
          const newd = {
            id: id,
            ten: NormalizeString(tendv),
            ghichu: ghichu,
            giadv: giadichvu,
            trangthai: trangthai,
            anh: anhDV,
            filename: filename,
            loaidichvu_id: loai,
          };
          console.log();
          if (JSON.stringify(old) !== JSON.stringify(newd)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old },
              newdata: { new: newd },
              tbl: "Dịch vụ",
            });
          }

          setMsgDichVuActionSuccess("Sửa thành công.");
          setTimeout(() => {
            setMsgDichVuActionSuccess("");
          }, 2500);
          hi.push(`/quan-ly/danh-muc/dich-vu/${id}`);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="mb-5">
      <form
        action=""
        encType="multipart/form-data"
        className="border border-warning p-3"
      >
        <div className="form-group">
          <label htmlFor="tendv">Tên dịch vụ</label>
          <input
            type="text"
            id="tendv"
            className="form-control"
            value={tendv}
            onChange={(e) => setTenDV(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="anhdv">Ảnh đại diện</label>
          <img src={anhDV} alt="Ảnh dịch vụ" width="200" className="mx-3" />
          <input
            type="file"
            accept="image/*"
            id="anhdv"
            //
            onChange={(e) => {
              if (e.target.files[0]) {
                handleDeleteImagePrev();
                setFileName(e.target.files[0].name);
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="giadichvu">Giá dịch vụ</label>
          {/* <input
            id="giadichvu"
            type="number"
            min="10000"
            step="1000"
            className="form-control text-right"
            value={giadichvu}
            onChange={(e) => setGiaDichVu(e.target.value)}
          /> */}
          <CurrencyInput
            id="giadv"
            value={giadichvu}
            className="form-control text-right"
            suffix=" đồng"
            groupSeparator="."
            onValueChange={(value) => {
              setGiaDichVu(value);
            }}
            step="1000"
            maxLength="9"
          />
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

        <div className="form-group ">
          <label htmlFor="loaidv">Loại dịch vụ</label>
          <CreatableSelect
            id="loaidv"
            isClearable
            onChange={handleChange}
            options={loaiDv}
            styles={customStyles}
            value={loadDv}
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

export default SuaDichVu;
