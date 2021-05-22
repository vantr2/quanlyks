import React, { useContext, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import NormalizeString from "../../../utils/NormalizeString";
import ThemLichSu from "../../../utils/ThemLichSu";
const ThemNcc = () => {
  const [tenncc, setTenNcc] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [sdt, setSdt] = useState("");
  const [msgError, setMsgError] = useState("");

  const { themNcc, setMsgNccActionSuccess } = useContext(AccountContext);
  const handleSubmit = async () => {
    if (!tenncc) {
      setMsgError("Tên nhà cung cấp không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!sdt) {
      setMsgError("Số điện thoại không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (sdt.length < 10 || sdt.length > 11) {
      setMsgError("Số điện thoại không hợp lệ.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!diachi) {
      setMsgError("Địa chỉ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await NhaCungCapFinder.post("/them", {
          ten: NormalizeString(tenncc),
          diachi: NormalizeString(diachi),
          sdt: sdt,
        });
        if (res.data.status === "ok") {
          ThemLichSu({
            doing: "Thêm",
            olddata: {},
            newdata: { new: res.data.data.nhacungcap },
            tbl: "Nhà cung cấp",
          });
          themNcc(res.data.data.nhacungcap);
          setMsgNccActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgNccActionSuccess("");
          }, 2500);
          setDiaChi("");
          setSdt("");
          setTenNcc("");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="themnhacungcap">
          <div className="card">
            <div className="card-header" id="nhacungcapcard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthemnhacungcap"
                  aria-expanded="false"
                  aria-controls="formthemnhacungcap"
                  style={{ cursor: "pointer" }}
                >
                  Thêm nhà cung cấp
                </div>
              </h5>
            </div>
            <div
              id="formthemnhacungcap"
              className="collapse"
              aria-labelledby="nhacungcapcard"
              data-parent="#themnhacungcap"
            >
              <div className="card-body px-5">
                <form action="" encType="multipart/form-data">
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="tenncc">Tên nhà cung cấp</label>
                        <input
                          type="text"
                          id="tenncc"
                          className="form-control"
                          value={tenncc}
                          onChange={(e) => setTenNcc(e.target.value)}
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
                      value={diachi}
                      onChange={(e) => setDiaChi(e.target.value)}
                    ></textarea>
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

export default ThemNcc;
