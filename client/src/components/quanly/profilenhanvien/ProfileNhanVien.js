import React, { useContext, useEffect, useState } from "react";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { storage } from "../../../firebase";
import FileUploader from "react-firebase-file-uploader";
import { RenderGioiTinh, NormalizeDate } from "../../../utils/DataHandler";
import DoiMatKhau from "./DoiMatKhau";
import { AccountContext } from "../../../contexts/AccountContext";

const ProfileNhanVien = () => {
  const username = window.localStorage.getItem("user_name");

  const [nhanvienSelected, setNhanVienSelected] = useState([]);

  const [filename, setFileName] = useState("");
  const [avt, setAvt] = useState("");

  const [image, setImage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const { setUserAvartar } = useContext(AccountContext);
  const getFileName = async () => {
    try {
      const res = await TaiKhoanFinder.get(`/get-avt/${username}`);
      if (res.data.status === "ok") {
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NhanVienFinder.get(
          `/danh-sach-nhan-vien-theo-acc/${username}`
        );
        if (res.data.status === "ok") {
          setNhanVienSelected(res.data.data.nhanvien);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();

    const getAvtNow = async () => {
      try {
        const res = await TaiKhoanFinder.get(`/get-avt/${username}`);
        if (res.data.status === "ok") {
          console.log(res);
          setAvt(res.data.data.nguoidung.avt);
          setFileName(res.data.data.nguoidung.filename);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    getAvtNow();
  }, [setNhanVienSelected, username, setAvt, setFileName]);

  const handleUpload = (fname) => {
    console.log(fname);
    setImage(fname);
    setProgress(100);
    setIsUploading(false);
    storage
      .ref("images")
      .child(fname)
      .getDownloadURL()
      .then((urlRetrieve) => {
        setAvt(urlRetrieve);
        setUserAvartar(urlRetrieve);
        handlePutData(fname, urlRetrieve);
        getFileName();
        console.log(filename);
        if (filename !== "no-user.jpg") {
          storage.ref(`images/${filename}`).delete(filename);
        }
      });
  };

  const handlePutData = async (fname, furl) => {
    try {
      await TaiKhoanFinder.put("/update-avt", {
        ten: username,
        avt: furl,
        filename: fname,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <div className="mt-5 d-flex ml-5">
        <div className="d-flex flex-column">
          <img
            alt="Avartar"
            width="300"
            height="300"
            className="border border-secondary mb-2"
            src={avt}
          />
          <label
            style={{
              backgroundColor: "blue",
              color: "white",
              padding: 10,
              borderRadius: 4,
              cursor: "pointer",
              width: "300px",
              textAlign: "center",
            }}
          >
            Sửa ảnh đại diện
            <FileUploader
              accept="image/*"
              name={image}
              storageRef={storage.ref("images")}
              onUploadStart={() => {
                setIsUploading(true);
                setProgress(0);
              }}
              onUploadError={(error) => {
                console.log(error);
                setIsUploading(false);
              }}
              onUploadSuccess={handleUpload}
              onProgress={(progress) => {
                setProgress(progress);
              }}
              hidden
            />
          </label>
          {isUploading ? (
            <progress value={progress} max="100" className="form-control">
              {" "}
              {progress}{" "}
            </progress>
          ) : (
            ""
          )}
        </div>
        <div className="flex-grow ml-5 pl-5 mt-3">
          <h4>
            Họ và tên:{" "}
            <span className="font-weight-normal">{nhanvienSelected.name}</span>
          </h4>
          <h4>
            Giới tính:{" "}
            <span className="font-weight-normal">
              {RenderGioiTinh(nhanvienSelected.gioitinh)}
            </span>
          </h4>
          <h4>
            Ngày sinh:{" "}
            <span className="font-weight-normal">
              {NormalizeDate(nhanvienSelected.ngaysinh)}
            </span>
          </h4>
          <h4>
            Chứng minh nhân dân:{" "}
            <span className="font-weight-normal">{nhanvienSelected.cmnd}</span>
          </h4>
          <h4>
            Số điện thoại:{" "}
            <span className="font-weight-normal">{nhanvienSelected.sdt}</span>
          </h4>
          <h4>
            Email:{" "}
            <span className="font-weight-normal">{nhanvienSelected.email}</span>
          </h4>
          <h4>
            Địa chỉ:{" "}
            <span className="font-weight-normal">
              {nhanvienSelected.diachi}
            </span>
          </h4>
          <h4>
            Tài khoản đang sử dụng:{" "}
            <span className="font-weight-normal">
              {nhanvienSelected.account}
            </span>
          </h4>
          <DoiMatKhau
            ten={nhanvienSelected.account}
            iv={nhanvienSelected.iv}
            mk={nhanvienSelected.mk}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileNhanVien;
