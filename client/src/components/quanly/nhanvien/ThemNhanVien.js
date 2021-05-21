import React, { useContext, useState } from "react";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import { useHistory } from "react-router";
import {
  checkSpecialCharacter,
  validateEmail,
  dontSignEmail,
  convertDate,
  convertTime,
} from "../../../utils/DataHandler";
import DateTimePicker from "react-datetime-picker";

import NormalizeString from "../../../utils/NormalizeString";

const ThemNhanVien = () => {
  const [tenNV, setTenNV] = useState("");
  const [gioitinh, setGioiTinh] = useState("1");
  const [ngaysinh, setNgaySinh] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [cmnd, setCMND] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [ngayvaolam, setNgayVaoLam] = useState("");
  const [vaitro, setVaiTro] = useState("NVLT");

  const [acc, setAcc] = useState("");
  const [msg, setMsg] = useState("");

  const { setMsgNhanVienActionSuccess } = useContext(AccountContext);
  let hi = useHistory();
  const userrole = window.localStorage.getItem("user_role");
  const handleSubmit = async () => {
    const english = /^[A-Za-z0-9]*$/;
    if (acc.length === 0) {
      setMsg("Tên tài khoản không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (acc.indexOf(" ") >= 0) {
      setMsg("Tên tài khoản không được chứa khoảng trắng.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (!english.test(acc)) {
      setMsg("Tên tài khoản không được chứa kí tự đặc biệt hoặc dấu.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (acc.length > 0 && acc.length < 6) {
      setMsg("Tên tài khoản ít nhất phải có 6 kí tự.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (!ngayvaolam) {
      setMsg("Ngày vào làm không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 3500);
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
        const res = await TaiKhoanFinder.post("/them-tai-khoan", {
          ten: acc,
          mk: "12345678",
          ten_hienthi: NormalizeString(tenNV),
          vaitro: vaitro,
        });

        //   console.log(res);
        if (res.data.status === "ok") {
          const res_nv = await NhanVienFinder.post("/them-nhan-vien", {
            ten: NormalizeString(tenNV),
            gioitinh: parseInt(gioitinh),
            ngaysinh: ngaysinh,
            diachi: NormalizeString(diachi),
            cmnd: cmnd,
            sdt: sdt,
            email: email.toLowerCase(),
            taikhoan: acc,
            ngayvaolam:
              convertDate(ngayvaolam) + " " + convertTime(ngayvaolam) + "-07",
          });
          // console.log(res);
          if (res_nv.data.status === "ok") {
            setMsgNhanVienActionSuccess("Thêm thành công.");
            setTimeout(() => {
              setMsgNhanVienActionSuccess("");
            }, 3000);

            hi.push("/quan-ly/danh-muc");
            hi.push("/quan-ly/danh-muc/nhan-vien");
          }
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
                      <input
                        type="text"
                        className="form-control"
                        id="acc"
                        onChange={(e) => setAcc(e.target.value)}
                        value={acc}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="vaitronv">Chức vụ</label>
                      <select
                        className="form-control"
                        id="vaitronv"
                        value={vaitro}
                        onChange={(e) => setVaiTro(e.target.value)}
                      >
                        {userrole === "QL" ? (
                          ""
                        ) : (
                          <option value="QL">Quản lý</option>
                        )}

                        <option value="NVLT">Lễ tân</option>
                        <option value="NVDP">Dọn phòng</option>
                        <option value="NVK">Ql Kho</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-row">
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
                  <div className="col">
                    <label htmlFor="ngayvaolam">Ngày vào làm</label>
                    <DateTimePicker
                      className="form-control"
                      value={ngayvaolam}
                      onChange={setNgayVaoLam}
                      disableClock
                      locale="vi-VN"
                      format="dd-MM-y h:mm a"
                      id="ngayvaolam"
                      minDate={new Date()}
                    />
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
