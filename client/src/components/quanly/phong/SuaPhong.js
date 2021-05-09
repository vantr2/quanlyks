import React, { useContext, useEffect, useState } from "react";
import PhongFinder from "../../../apis/PhongFinder";
import { useHistory, useParams } from "react-router";
import NormalizeString from "../../../utils/NormalizeString";
import { AccountContext } from "../../../contexts/AccountContext";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { storage } from "../../../firebase";
import CurrencyInput from "react-currency-input-field";

const SuaPhong = () => {
  let hi = useHistory();
  const { ten } = useParams();

  const [tenphong, setTenPhong] = useState("");
  const [anhphong, setAnhPhong] = useState("");
  const [filename, setFileName] = useState("");
  const [giaphongtheongay, setGiaPhongTheoNgay] = useState("");
  const [giaphongtheogio, setGiaPhongTheoGio] = useState("");
  const [tieude, setTieuDe] = useState("");
  const [motangangon, setMoTaNganGon] = useState("");
  const [motachitiet, setMoTaChiTiet] = useState("");
  const [trangthai, setTrangThai] = useState("");

  const [msgError, setMsgError] = useState("");
  const { setMsgPhongActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhongFinder.get(`/danh-sach-phong/${ten}`);
        const phongUpdate = res.data.data.phong;
        setTenPhong(phongUpdate.ten);
        setAnhPhong(phongUpdate.anh);
        setFileName(phongUpdate.filename);
        setGiaPhongTheoGio(phongUpdate.giaphongtheogio);
        setGiaPhongTheoNgay(phongUpdate.giaphongtheongay);
        setTieuDe(phongUpdate.tieude);
        setMoTaNganGon(phongUpdate.mota_ngangon);
        setMoTaChiTiet(phongUpdate.mota_chitiet);
        setTrangThai(phongUpdate.trangthai);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [ten]);

  const handleDeleteImagePrev = () => {
    storage.ref("phong").child(filename).delete();
  };

  const handleUpdate = async () => {
    if (!tenphong) {
      setMsgError("Tên phòng không được để trống.");
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
        const res = await PhongFinder.put("/sua-phong", {
          ten: NormalizeString(tenphong),
          trangthai: trangthai,
          anh: anhphong,
          tieude: NormalizeString(tieude),
          mtngangon: motangangon,
          mtchitiet: motachitiet,
          giaphongtheongay: giaphongtheongay,
          giaphongtheogio: giaphongtheogio,
          filename: filename,
        });
        // console.log(res);
        if (res.data.status === "ok") {
          setMsgPhongActionSuccess("Sửa thành công.");
          setTimeout(() => {
            setMsgPhongActionSuccess("");
          }, 2500);
          hi.push(`/quan-ly/danh-muc/phong/${ten}`);
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
  const goBack = () => {
    hi.push(`/quan-ly/danh-muc/phong/${ten}`);
  };

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

  return (
    <div>
      <form action="" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="anhphong">Ảnh đại diện</label>
          <img src={anhphong} alt="Ảnh phòng" width="300" />
          <input
            type="file"
            accept="image/*"
            id="anhphong"
            className="form-control"
            onChange={(e) => {
              if (e.target.files[0]) {
                handleDeleteImagePrev();
                setFileName(e.target.files[0].name);
                handleUpload(e.target.files[0]);
              }
            }}
          />
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="giaphong">Giá phòng theo ngày</label>
              {/* <input
                type="number"
                min="10000"
                step="1000"
                id="giaphong"
                className="form-control text-right"
                value={giaphongtheongay}
                onChange={(e) => setGiaPhongTheoNgay(e.target.value)}
              /> */}
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
              {/* <input
                id="giacanhtranh"
                type="number"
                min="10000"
                step="1000"
                className="form-control text-right"
                value={giaphongtheogio}
                onChange={(e) => setGiaPhongTheoGio(e.target.value)}
              /> */}
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

export default SuaPhong;
