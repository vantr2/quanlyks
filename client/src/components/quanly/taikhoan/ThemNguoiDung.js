import React, { useContext, useState } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import NormalizeString from "../../../utils/NormalizeString";

const ThemNguoiDung = () => {
  const [tenND, setTenND] = useState("");
  const [mk, setMk] = useState("");
  const [tenHT, setTenHT] = useState("");
  const [vaitro, setVaiTro] = useState("KH");
  const [msg, setMsg] = useState("");
  const [msgS, setMsgS] = useState("");

  const { themNguoiDung } = useContext(AccountContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errorCount = 0;
    const english = /^[A-Za-z0-9]*$/;
    if (tenHT.length === 0) {
      errorCount++;
      setMsg("Tên hiển thị không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    }

    if (mk.length === 0) {
      errorCount++;
      setMsg("Mật khẩu không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (mk.indexOf(" ") >= 0) {
      errorCount++;
      setMsg("Mật khẩu không được chứa khoảng trắng.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (!english.test(mk)) {
      errorCount++;
      setMsg("Mật khẩu không được chứa kí tự đặc biệt hoặc dấu.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (mk.length > 0 && mk.length < 8) {
      errorCount++;
      setMsg("Mật khẩu ít nhất phải có 8 kí tự.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    }

    if (tenND.length === 0) {
      errorCount++;
      setMsg("Tên tài khoản không được để trống.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (tenND.indexOf(" ") >= 0) {
      errorCount++;
      setMsg("Tên tài khoản không được chứa khoảng trắng.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (!english.test(tenND)) {
      errorCount++;
      setMsg("Tên tài khoản không được chứa kí tự đặc biệt hoặc dấu.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    } else if (tenND.length > 0 && tenND.length < 6) {
      errorCount++;
      setMsg("Tên tài khoản ít nhất phải có 6 kí tự.");
      setTimeout(() => {
        setMsg("");
      }, 4000);
    }

    if (errorCount === 0) {
      try {
        const res = await TaiKhoanFinder.post("/them-tai-khoan", {
          ten: tenND,
          mk: mk,
          ten_hienthi: NormalizeString(tenHT),
          vaitro: vaitro,
        });

        //   console.log(res);
        if (res.data.status === "ok") {
          themNguoiDung(res.data.data.acc);
          setTenHT("");
          setVaiTro("NVLT");
          setMsgS("Thêm thành công.");
          setTimeout(() => {
            setMsgS("");
          }, 2500);
        } else {
          setMsg(res.data.status);
          setTimeout(() => {
            setMsg("");
          }, 3000);
        }

        setMk("");
        setTenND("");
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="mt-5 mb-2 ">
      <div id="themtaikhoan">
        <div className="card">
          <div className="card-header" id="taikhoancard">
            <h5 className="mb-0">
              <div
                className="text-primary collapsed"
                data-toggle="collapse"
                data-target="#formthemtaikhoan"
                aria-expanded="false"
                aria-controls="formthemtaikhoan"
                style={{ cursor: "pointer" }}
              >
                Thêm tài khoản
              </div>
            </h5>
          </div>
          <div
            id="formthemtaikhoan"
            className="collapse"
            aria-labelledby="taikhoancard"
            data-parent="#themtaikhoan"
          >
            <div className="card-body px-5">
              <form action="">
                <div className="form-row">
                  <div className="col">
                    <div className="form-group mx-4">
                      <label htmlFor="tennguoidung">Tên người dùng</label>
                      <input
                        type="text"
                        id="tennguoidung"
                        className="form-control"
                        onChange={(e) => setTenND(e.target.value)}
                        value={tenND}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group mx-4">
                      <label htmlFor="matkhau">Mật khẩu</label>
                      <input
                        type="password"
                        id="matkhau"
                        className="form-control"
                        onChange={(e) => setMk(e.target.value)}
                        value={mk}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <div className="col">
                    <div className="form-group mx-4">
                      <label htmlFor="tenhienthi">Tên hiển thị</label>
                      <input
                        type="text"
                        id="tenhienthi"
                        className="form-control"
                        onChange={(e) => setTenHT(e.target.value)}
                        value={tenHT}
                      />
                    </div>
                  </div>

                  <div className="col">
                    <div className="form-group mx-4">
                      <label htmlFor="vaitro">Vai trò</label>
                      <select
                        className="form-control"
                        id="vaitro"
                        onChange={(e) => setVaiTro(e.target.value)}
                        value={vaitro}
                      >
                        <option value="KH">Khách hàng</option>
                        <option value="NVLT">Nhân viên lễ tân</option>
                        <option value="QL">Nhân viên quản lý</option>
                        <option value="NVK">Nhân viên thu chi</option>
                        <option value="NVDP">Nhân viên dọn phòng</option>
                      </select>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-primary px-4 ml-4"
                  onClick={handleSubmit}
                >
                  Thêm
                </button>
              </form>
              <p className="text-danger ml-4 my-2">{msg}</p>
              <p className="text-success ml-4 my-2">{msgS}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemNguoiDung;
