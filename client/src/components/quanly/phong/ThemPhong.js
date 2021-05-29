import React, { useContext, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { AccountContext } from "../../../contexts/AccountContext";
import PhongFinder from "../../../apis/PhongFinder";
import NormalizeString from "../../../utils/NormalizeString";
import { storage } from "../../../firebase";
import CurrencyInput from "react-currency-input-field";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThemPhong = () => {
  const [tenphong, setTenPhong] = useState("");
  const [anhphong, setAnhPhong] = useState("");
  const [filename, setFileName] = useState("");
  const [giaphongtheongay, setGiaPhongTheoNgay] = useState("");
  const [giaphongtheogio, setGiaPhongTheoGio] = useState("");
  const [tieude, setTieuDe] = useState("");
  const [motangangon, setMoTaNganGon] = useState("");

  const [motachitiet, setMoTaChiTiet] = useState("");
  const [loaiphong, setLoaiPhong] = useState("Phòng đơn");
  const [msgError, setMsgError] = useState("");

  const [image, setImage] = useState("");

  const { themPhong, setMsgPhongActionSuccess } = useContext(AccountContext);

  const handleUpload = (img) => {
    const uploadTask = storage.ref(`phong/${img.name}`).put(img);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log(error);
      },
      () => {
        storage
          .ref("phong")
          .child(img.name)
          .getDownloadURL()
          .then((url) => {
            setAnhPhong(url);
          });
      }
    );
  };
  const handleSubmit = async () => {
    if (!tenphong) {
      setMsgError("Tên phòng không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!image) {
      setMsgError("Ảnh phòng không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!giaphongtheongay) {
      setMsgError("Giá phòng theo ngày không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!giaphongtheogio) {
      setMsgError("Giá phòng theo giờ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!tieude) {
      setMsgError("Tiêu đề không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!motangangon) {
      setMsgError("Mô tả ngắn gọn không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!motachitiet) {
      setMsgError("Mô tả chi tiết không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await PhongFinder.post("/them-phong", {
          ten: NormalizeString(tenphong),
          trangthai: 0,
          anh: anhphong,
          tieude: NormalizeString(tieude),
          mtngangon: motangangon,
          mtchitiet: motachitiet,
          giaphongtheongay: giaphongtheongay,
          giaphongtheogio: giaphongtheogio,
          filename: filename,
          loaiphong: loaiphong,
        });
        // console.log(res);
        if (res.data.status === "ok") {
          ThemLichSu({
            doing: "Thêm",
            olddata: {},
            newdata: { new: res.data.data.phong },
            tbl: "Phòng",
          });

          themPhong(res.data.data.phong);
          setMsgPhongActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgPhongActionSuccess("");
          }, 2500);
          setTenPhong("");
          setImage("");
          setTieuDe("");
          setMoTaChiTiet("");
          setMoTaNganGon("");
          setGiaPhongTheoGio("");
          setGiaPhongTheoNgay("");
        } else {
          setMsgError(res.data.status);
          setTimeout(() => {
            setMsgError("");
          }, 4000);
        }
      } catch (er) {
        console.log(er.message);
      }
    }
  };

  const handleDeleteImagePrev = () => {
    if (filename) {
      storage.ref("phong").child(filename).delete();
    }
  };
  return (
    <div className="mt-5 mb-2">
      <div id="themphong">
        <div className="card">
          <div className="card-header" id="phongcard">
            <h5 className="mb-0">
              <div
                className="text-primary collapsed"
                data-toggle="collapse"
                data-target="#formthemphong"
                aria-expanded="false"
                aria-controls="formthemphong"
                style={{ cursor: "pointer" }}
              >
                Thêm phòng
              </div>
            </h5>
          </div>
          <div
            id="formthemphong"
            className="collapse"
            aria-labelledby="phongcard"
            data-parent="#themphong"
          >
            <div className="card-body px-5">
              <form action="" encType="multipart/form-data">
                <div className="form-group">
                  <label htmlFor="tenphong">Tên phòng</label>
                  <input
                    type="text"
                    id="tenphong"
                    className="form-control"
                    value={tenphong}
                    onChange={(e) => setTenPhong(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="anhphong">Ảnh đại diện</label>
                  <input
                    type="file"
                    accept="image/*"
                    id="anhphong"
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

                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="giaphong">Giá phòng theo ngày</label>

                      <CurrencyInput
                        id="giaphong"
                        value={giaphongtheongay}
                        className="form-control text-right"
                        suffix=" đồng"
                        groupSeparator="."
                        onValueChange={(value) => {
                          setGiaPhongTheoNgay(value);
                        }}
                        step="1000"
                        maxLength="9"
                      />
                    </div>
                  </div>
                  <div className="col">
                    {" "}
                    <div className="form-group">
                      <label htmlFor="giacanhtranh">Giá phòng theo giờ</label>

                      <CurrencyInput
                        id="giacanhtranh"
                        value={giaphongtheogio}
                        className="form-control text-right"
                        suffix=" đồng"
                        groupSeparator="."
                        onValueChange={(value) => {
                          setGiaPhongTheoGio(value);
                        }}
                        step="1000"
                        maxLength="9"
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="loaiphong">Loại phòng</label>
                      <select
                        id="loaiphong"
                        className="form-control"
                        value={loaiphong}
                        onChange={(e) => setLoaiPhong(e.target.value)}
                      >
                        <option value="Phòng đơn">Phòng đơn</option>
                        <option value="Phòng đôi">Phòng đôi</option>
                        <option value="Gia đình">Gia đình</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="tieude">Tiêu đề</label>
                  <input
                    type="text"
                    id="tieude"
                    className="form-control"
                    value={tieude}
                    onChange={(e) => setTieuDe(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="motangangon">Mô tả ngắn gọn</label>
                  <textarea
                    className="form-control"
                    id="motangangon"
                    rows="2"
                    value={motangangon}
                    onChange={(e) => setMoTaNganGon(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-group">
                  <label htmlFor="motachitiet">Mô tả chi tiết</label>
                  <CKEditor
                    data={motachitiet}
                    editor={ClassicEditor}
                    onChange={(event, editor) => {
                      const data = editor.getData();
                      setMoTaChiTiet(data);
                    }}
                    config={{
                      ckfinder: {
                        uploadUrl: "http://localhost:3005/api/v1/phong/uploads",
                      },
                    }}
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
  );
};

export default ThemPhong;
