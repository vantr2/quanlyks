import React, { useState } from "react";
import KiemTraDangNhapBackEnd from "../../apis/KiemTraDangNhapBackEnd";
import ReactIsCapsLockActive from "@matsun/reactiscapslockactive";
import ThemLichSu from "../../utils/ThemLichSu";

const LoginBackEnd = () => {
  const [ten, setTen] = useState("");
  const [mk, setMk] = useState("");
  const [messageError, setMessageError] = useState("");

  const handleSubmit = async () => {
    const english = /^[A-Za-z0-9]*$/;
    if (ten === "") {
      setMessageError("Bạn phải nhập tên tài khoản. Không được để trống");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else if (ten.indexOf(" ") >= 0) {
      setMessageError("Tên tài khoản không được chứa khoảng trắng.");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else if (!english.test(ten)) {
      setMessageError("Tên tài khoản không được chứa kí tự đặc biệt hoặc dấu.");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else if (ten.length > 0 && ten.length < 6) {
      setMessageError("Tên tài khoản ít nhất phải có 6 kí tự.");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else if (mk === "") {
      setMessageError("Bạn phải nhập mật khẩu. Không được để trống");
    } else if (mk.indexOf(" ") >= 0) {
      setMessageError("Mật khẩu không được chứa khoảng trắng.");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else if (!english.test(mk)) {
      setMessageError("Mật khẩu không được chứa kí tự đặc biệt hoặc dấu.");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else if (mk.length > 0 && mk.length < 8) {
      setMessageError("Mật khẩu ít nhất phải có 8 kí tự.");
      setTimeout(() => {
        setMessageError("");
      }, 4000);
    } else {
      try {
        const res = await KiemTraDangNhapBackEnd.post("/", {
          ten: ten,
          mk: mk,
          vaitro: "KH",
        });
        // console.log(typeof res.data.data.ten_ht);
        if (res.data.status !== "ok") {
          setMessageError(res.data.status);
          setTimeout(() => {
            setMessageError("");
          }, 3000);
        } else {
          window.localStorage.setItem("dangnhap", "true");
          window.localStorage.setItem("user_name", res.data.data.ten);
          window.localStorage.setItem("user_displayname", res.data.data.ten_ht);
          window.localStorage.setItem("user_role", res.data.data.vaitro);
          window.localStorage.setItem("user_avt", res.data.data.avt);

          ThemLichSu({
            doing: "Đăng nhập",
            olddata: {},
            newdata: {},
            tbl: "Người dùng",
          });

          window.location.href = "/";
        }
      } catch (err) {
        console.error(err.message);
      }
    }
  };
  return (
    <div className="row d-flex justify-content-center mt-5">
      <div className="col-sm-4 mt-5 border border-5 rounded px-5 pb-5 border-mute  ">
        <h1 className="text-center mt-4 mb-5">Đăng nhập</h1>

        <form action="" className="need-validated mx-4">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fas fa-user text-primary"></i>
              </span>
            </div>
            <input
              type="text"
              placeholder="Nhập tên tài khoản"
              id="username"
              className="form-control"
              title="Vui lòng điền tài khoản vào đây"
              value={ten}
              onChange={(e) => {
                setTen(e.target.value);
              }}
              required
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fas fa-key text-primary"></i>
              </span>
            </div>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              id="password"
              className="form-control"
              title="Vui lòng điền mật khẩu vào đây"
              value={mk}
              onChange={(e) => {
                setMk(e.target.value);
              }}
              required
            />
          </div>

          <p className="text-danger">{messageError}</p>
          <ReactIsCapsLockActive>
            {(active) => (
              <p className="text-danger">
                {" "}
                {active ? "Caps lock đang bật. Vui lòng tắt" : ""}
              </p>
            )}
          </ReactIsCapsLockActive>
          {/* <div className="form-check mb-3">
            <label className="form-check-label">
              <input
                type="checkbox"
                className="form-check-input"
                value={checked}
                onChange={(e) => setChecked(e.target.checked)}
              />
              Nhớ mật khẩu
            </label>
          </div> */}
          <button
            type="button"
            className="btn btn-primary form-control py-2"
            onClick={handleSubmit}
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginBackEnd;
