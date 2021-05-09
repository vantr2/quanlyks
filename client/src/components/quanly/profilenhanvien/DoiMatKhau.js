import React, { useState } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
const DoiMatKhau = ({ ten, iv, mk }) => {
  const [mkCu, setMkCu] = useState("");
  const [mkMoi, setMkMoi] = useState("");
  const [xnMKMoi, setXnMkMoi] = useState("");
  const [msgE, setMsgE] = useState("");
  const [msgS, setMsgS] = useState("");

  const handleChangePassword = async () => {
    if (mkCu === "") {
      setMsgE("Không được để trống ô mật khẩu cũ");
      setTimeout(() => {
        setMsgE("");
      }, 3500);
    } else if (mkCu.length < 8) {
      setMsgE("Mật khẩu cũ ít nhất có 8 kí tự");
      setTimeout(() => {
        setMsgE("");
      }, 3500);
    } else if (mkMoi === "") {
      setMsgE("Không được để trống ô mật khẩu mới");
      setTimeout(() => {
        setMsgE("");
      }, 3500);
    } else if (mkMoi.length < 8) {
      setMsgE("Mật khẩu mới ít nhất có 8 kí tự");
      setTimeout(() => {
        setMsgE("");
      }, 3500);
    } else if (xnMKMoi === "") {
      setMsgE("Không được để trống ô xác nhận mật khẩu mới");
      setTimeout(() => {
        setMsgE("");
      }, 4000);
    } else if (xnMKMoi !== mkMoi) {
      setMsgE("Mật khẩu mới và xác nhận mật khẩu mới phải giống nhau.");
      setTimeout(() => {
        setMsgE("");
      }, 4000);
    } else {
      try {
        const res = await TaiKhoanFinder.put("/doi-mat-khau", {
          ten: ten,
          mk: mk,
          iv: iv,
          mkcu: mkCu,
          mkmoi: mkMoi,
        });
        if (res.data.status === "ok") {
          setMsgS("Đổi mật khẩu thành công.");
          setTimeout(() => {
            setMsgS("");
          }, 3500);
        } else {
          setMsgE(res.data.status);
          setTimeout(() => {
            setMsgE("");
          }, 3500);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <button
        className="btn btn-info mt-2"
        type="button"
        data-toggle="modal"
        data-target="#doimatkhau"
      >
        Đổi mật khẩu
      </button>

      <div className="modal fade mb-5" id="doimatkhau">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Đổi mật khẩu</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="matkhaucu">Mật khẩu cũ</label>
                <input
                  type="password"
                  id="matkhaucu"
                  className="form-control"
                  value={mkCu}
                  onChange={(e) => {
                    setMkCu(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="matkhaumoi">Mật khẩu mới</label>
                <input
                  type="password"
                  id="matkhaumoi"
                  className="form-control"
                  value={mkMoi}
                  onChange={(e) => {
                    setMkMoi(e.target.value);
                  }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="xacnhanmkmoi">Xác nhận mật khẩu mới</label>
                <input
                  type="password"
                  id="xacnhanmkmoi"
                  className="form-control"
                  value={xnMKMoi}
                  onChange={(e) => {
                    setXnMkMoi(e.target.value);
                  }}
                />
              </div>
              <p className="text-left text-success">{msgS}</p>
              <p className="text-left text-danger">{msgE}</p>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-info font-weight-bold mr-2 px-4"
                onClick={handleChangePassword}
              >
                Đổi
              </button>
              <button
                type="button"
                className="btn btn-secondary font-weight-bold ml-2"
                data-dismiss="modal"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoiMatKhau;
