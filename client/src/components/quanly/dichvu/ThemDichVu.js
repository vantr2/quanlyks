import React, { useContext, useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AccountContext } from "../../../contexts/AccountContext";
import DichVuFinder from "../../../apis/DichVuFinder";
import NormalizeString from "../../../utils/NormalizeString";
import { storage } from "../../../firebase";
import CreatableSelect from "react-select/creatable";
import { convertDataTocreatableSelect } from "../../../utils/DataHandler";
import CurrencyInput from "react-currency-input-field";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThemDichVu = () => {
  const [tendv, setTenDV] = useState("");
  const [anhDV, setAnhDV] = useState("");
  const [filename, setFileName] = useState("");
  const [giadichvu, setGiaDichVu] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [loai, setLoai] = useState();

  const [msgError, setMsgError] = useState("");

  const [image, setImage] = useState("");
  const [loaiDv, setLoaiDv] = useState([]);

  const { themDichVu, setMsgDichVuActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const getDataCategory = async () => {
      try {
        const res = await DichVuFinder.get("/danh-sach-loai-dich-vu");
        setLoaiDv(convertDataTocreatableSelect(res.data.data.loaidv));
      } catch (err) {
        console.log(err.message);
      }
    };
    getDataCategory();
  }, [setLoaiDv]);

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

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "black" : "#51515",
      padding: 5,
    }),
  };

  const handleSubmit = async () => {
    if (!tendv) {
      setMsgError("Tên dịch vụ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!image) {
      setMsgError("Ảnh minh họa không được để trống.");
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
    } else if (!loai) {
      setMsgError("Loại dịch vụ không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await DichVuFinder.post("/them-dich-vu", {
          ten: NormalizeString(tendv),
          ghichu: ghichu,
          giadv: giadichvu,
          trangthai: 1,
          anh: anhDV,
          filename: filename,
          loaidv: loai,
        });

        if (res.data.status === "ok") {
          ThemLichSu({
            doing: "Thêm",
            olddata: {},
            newdata: { new: res.data.data.dichvu },
            tbl: "Dịch vụ",
          });

          themDichVu(res.data.data.dichvu);
          setMsgDichVuActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgDichVuActionSuccess("");
          }, 2500);
          setTenDV("");
          setImage("");
          setGhiChu("");
          setGiaDichVu("");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleDeleteImagePrev = () => {
    if (filename) {
      storage.ref("dichvu").child(filename).delete();
    }
  };

  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="themdichvu">
          <div className="card">
            <div className="card-header" id="dichvucard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthemdichvu"
                  aria-expanded="false"
                  aria-controls="formthemdichvu"
                  style={{ cursor: "pointer" }}
                >
                  Thêm dịch vụ
                </div>
              </h5>
            </div>
            <div
              id="formthemdichvu"
              className="collapse"
              aria-labelledby="dichvucard"
              data-parent="#themdichvu"
            >
              <div className="card-body px-5">
                <form action="" encType="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="tendichvu">Tên dịch vụ</label>
                    <input
                      type="text"
                      id="tendichvu"
                      className="form-control"
                      value={tendv}
                      onChange={(e) => setTenDV(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="anhdv">Ảnh dịch vụ</label>
                    <input
                      type="file"
                      accept="image/*"
                      id="anhdv"
                      className="form-control"
                      onChange={(e) => {
                        if (e.target.files[0]) {
                          handleDeleteImagePrev();
                          setImage(e.target.files[0]);
                          setFileName(e.target.files[0].name);
                          handleUpload(e.target.files[0]);
                        } else {
                          setImage("");
                        }
                      }}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="giadv">Giá dịch vụ</label>
                    {/* <input
                      type="number"
                      min="10000"
                      step="1000"
                      id="giadv"
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
                    />
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

export default ThemDichVu;
