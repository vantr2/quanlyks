import React, { useContext, useEffect, useState } from "react";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { useHistory, useParams } from "react-router";
import ThemLichSu from "../../../utils/ThemLichSu";
import {
  checkSpecialCharacter,
  validateEmail,
  dontSignEmail,
  convertDate,
} from "../../../utils/DataHandler";
import NormalizeString from "../../../utils/NormalizeString";
import { AccountContext } from "../../../contexts/AccountContext";
// import CurrencyInput from "react-currency-input-field";

const SuaNhanVien = () => {
  let hi = useHistory();
  const { id } = useParams();

  const [old, setOld] = useState({});
  const [tenNV, setTenNV] = useState("");
  const [gioitinh, setGioiTinh] = useState("");
  const [ngaysinh, setNgaySinh] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [cmnd, setCMND] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  //   const [luongcb, setLuongCb] = useState("");
  const [msg, setMsg] = useState("");
  const { setMsgNhanVienActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NhanVienFinder.get(`/danh-sach-nhan-vien/${id}`);
        // console.log(res.data.data.nhanvien.ngaysinh);
        setTenNV(res.data.data.nhanvien.name);
        setGioiTinh(res.data.data.nhanvien.gioitinh);
        setNgaySinh(convertDate(res.data.data.nhanvien.ngaysinh));
        setDiaChi(res.data.data.nhanvien.diachi);
        setCMND(res.data.data.nhanvien.cmnd);
        setSdt(res.data.data.nhanvien.sdt);
        setEmail(res.data.data.nhanvien.email);
        // setLuongCb(res.data.data.nhanvien.luongcoban);
        // console.log(res.data.data.nhanvien);

        setOld({
          id: id,
          ten: res.data.data.nhanvien.name,
          gioitinh: res.data.data.nhanvien.gioitinh,
          ngaysinh: convertDate(res.data.data.nhanvien.ngaysinh),
          diachi: res.data.data.nhanvien.diachi,
          cmnd: res.data.data.nhanvien.cmnd,
          sdt: res.data.data.nhanvien.sdt,
          email: res.data.data.nhanvien.email,
          //   luongcoban: res.data.data.nhanvien.luongcoban,
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [id]);

  const handleUpdate = async () => {
    if (tenNV === "") {
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
        const res = await NhanVienFinder.put("/sua-nhan-vien", {
          id: id,
          ten: NormalizeString(tenNV),
          gioitinh: parseInt(gioitinh),
          ngaysinh: ngaysinh,
          diachi: NormalizeString(diachi),
          cmnd: cmnd,
          sdt: sdt,
          email: email.toLowerCase(),
          //   luongcoban: luongcb,
        });
        if (res.data.status === "ok") {
          const newd = {
            id: id,
            ten: NormalizeString(tenNV),
            gioitinh: parseInt(gioitinh),
            ngaysinh: ngaysinh,
            diachi: NormalizeString(diachi),
            cmnd: cmnd,
            sdt: sdt,
            email: email.toLowerCase(),
            // luongcoban: luongcb,
          };
          if (JSON.stringify(old) !== JSON.stringify(newd)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old: old },
              newdata: { new: newd },
              tbl: "Nhân viên",
            });
          }
          setMsgNhanVienActionSuccess("Sửa thành công");
          setTimeout(() => {
            setMsgNhanVienActionSuccess("");
          }, 2000);
          hi.push(`/quan-ly/danh-muc/nhan-vien/`);
        } else {
          setMsg(res.data.status);
          setTimeout(() => {
            setMsg("");
          }, 5000);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-8">
        <form action="">
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
            {/* <div className="col">
              <div className="form-group">
                <label htmlFor="luongcoban">Lương cơ bản</label>
                <CurrencyInput
                  id="luongcoban"
                  value={luongcb}
                  className="form-control text-right"
                  suffix=" đồng"
                  groupSeparator="."
                  onValueChange={(value) => {
                    setLuongCb(value);
                  }}
                  step="1000"
                  maxLength="9"
                />
              </div>
            </div> */}
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
          <p className="text-danger my-2">{msg}</p>
          <div className="d-flex flex-row">
            <button
              className="btn btn-warning px-4"
              type="button"
              onClick={handleUpdate}
            >
              Sửa
            </button>
          </div>
        </form>
      </div>
      <div className="col-2"></div>
    </div>
  );
};

export default SuaNhanVien;
