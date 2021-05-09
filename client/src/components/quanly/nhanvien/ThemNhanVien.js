import React, { useContext, useEffect, useState } from "react";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import {
  checkSpecialCharacter,
  validateEmail,
  dontSignEmail,
} from "../../../utils/DataHandler";

import NormalizeString from "../../../utils/NormalizeString";

const ThemNhanVien = () => {
  const [tenNV, setTenNV] = useState("");
  const [gioitinh, setGioiTinh] = useState("1");
  const [ngaysinh, setNgaySinh] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [cmnd, setCMND] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [acc, setAcc] = useState("--Chọn--");
  const [msg, setMsg] = useState("");
  const [accFiletered, setAccFiletered] = useState([]);

  const { themNhanVien, setMsgNhanVienActionSuccess } = useContext(
    AccountContext
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await TaiKhoanFinder.get("/loc-nguoi-dung-duoc-cap-quyen");
        setAccFiletered(res.data.data.nguoidung);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setAccFiletered]);

  const handleSubmit = async () => {
    if (acc === "--Chọn--") {
      setMsg("Bạn cần chọn tài khoản cho nhân viên.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (tenNV === "") {
      setMsg("Tên nhân viên không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (checkSpecialCharacter(tenNV)) {
      setMsg("Tên nhân viên không được chưa kí tự đặc biệt.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (email === "") {
      setMsg("Email không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 3500);
    } else if (!validateEmail(email) || !dontSignEmail(email)) {
      setMsg("Email không hợp lệ.");
      setTimeout(() => {
        setMsg("");
      }, 3500);
    } else if (ngaysinh === "") {
      setMsg("Ngày sinh không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 3500);
    } else if (cmnd === "") {
      setMsg("Chứng minh nhân dân không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (cmnd.length !== 12) {
      setMsg("Chứng minh nhân dân không hợp lệ. (gồm 12 số). ");
      setTimeout(() => {
        setMsg("");
      }, 3500);
    } else if (sdt.length === 0) {
      setMsg("Số điện thoại không được để trống. ");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (sdt.length < 10 || sdt.length > 11) {
      setMsg(
        "Số điện thoại không hợp lệ. (gồm 10 số với di động, 11 số với máy bàn)."
      );
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } else if (diachi.length === 0) {
      setMsg("Địa chỉ không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 3000);
    } else {
      try {
        const res = await NhanVienFinder.post("/them-nhan-vien", {
          ten: NormalizeString(tenNV),
          gioitinh: parseInt(gioitinh),
          ngaysinh: ngaysinh,
          diachi: NormalizeString(diachi),
          cmnd: cmnd,
          sdt: sdt,
          email: email.toLowerCase(),
          taikhoan: acc,
        });
        // console.log(res);
        if (res.data.status === "ok") {
          themNhanVien(res.data.data.nhanvien);
          setMsgNhanVienActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgNhanVienActionSuccess("");
          }, 3000);

          setAcc("--Chọn--");
          setTenNV("");
          setEmail("");
          setNgaySinh("");
          setGioiTinh("1");
          setCMND("");
          setSdt("");
          setDiaChi("");
        } else {
          setMsg(res.data.status);
          setTimeout(() => {
            setMsg("");
          }, 3000);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="mt-5 mb-2">
      <div id="themnhanvien">
        <div className="card">
          <div className="card-header" id="nhanviencard">
            <h5 className="mb-0">
              <div
                className="text-primary collapsed"
                data-toggle="collapse"
                data-target="#formthemnhanvien"
                aria-expanded="false"
                aria-controls="formthemnhanvien"
                style={{ cursor: "pointer" }}
              >
                Thêm nhân viên
              </div>
            </h5>
          </div>
          <div
            id="formthemnhanvien"
            className="collapse"
            aria-labelledby="nhanviencard"
            data-parent="#themnhanvien"
          >
            <div className="card-body px-5">
              <form action="">
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="acc">Tài khoản</label>
                      <select
                        onChange={(e) => setAcc(e.target.value)}
                        value={acc}
                        id="acc"
                        className="form-control"
                      >
                        <option value="--Chọn--" disabled>
                          -- Chọn --
                        </option>
                        {accFiletered.map((tennd) => {
                          return (
                            <option key={tennd.ten} value={tennd.ten}>
                              {tennd.ten}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="tennhanvien">Tên nhân viên</label>
                      <input
                        type="text"
                        className="form-control"
                        id="tennhanvien"
                        onChange={(e) => setTenNV(e.target.value)}
                        value={tenNV}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col-6">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                      />
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="form-group">
                      <label htmlFor="gioitinh">Giới tính</label>
                      <select
                        onChange={(e) => setGioiTinh(e.target.value)}
                        value={gioitinh}
                        id="gioitinh"
                        className="form-control"
                      >
                        <option value="1">Nam</option>
                        <option value="0">Nữ</option>
                        <option value="2">KXD</option>
                      </select>
                    </div>
                  </div>
                  <div className="col-3">
                    <label htmlFor="ngaysinh">Ngày sinh</label>
                    <input
                      type="date"
                      id="ngaysinh"
                      className="form-control"
                      onChange={(e) => setNgaySinh(e.target.value)}
                      value={ngaysinh}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="cmnd">Chứng minh nhân dân</label>
                      <input
                        type="text"
                        className="form-control"
                        id="cmnd"
                        onChange={(e) => setCMND(e.target.value)}
                        value={cmnd}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="sdt">Số điện thoại</label>
                      <input
                        type="text"
                        className="form-control"
                        id="sdt"
                        onChange={(e) => setSdt(e.target.value)}
                        value={sdt}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="diachi">Địa chỉ</label>
                  <textarea
                    className="form-control"
                    id="diachi"
                    rows="2"
                    onChange={(e) => setDiaChi(e.target.value)}
                    value={diachi}
                  ></textarea>
                </div>

                <button
                  type="button"
                  className="btn btn-primary py-2 px-4"
                  onClick={handleSubmit}
                >
                  Thêm
                </button>
                <p className="text-danger my-2">{msg}</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemNhanVien;
