import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import { useHistory } from "react-router";
import { dateInPast } from "../../../utils/DataHandler";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThemXinNghi = () => {
  const [khinao, setKhiNao] = useState("");
  const [baolau, setBaoLau] = useState("--Chọn--");
  const [lydo, setLyDo] = useState("");
  const [msgError, setMsgError] = useState("");

  const [nhanvien, setNhanVien] = useState("");
  const username = window.localStorage.getItem("user_name");

  const { setMsgDonActionSuccess } = useContext(AccountContext);

  let hi = useHistory();
  useEffect(() => {
    const getNhanVien = async () => {
      try {
        const res = await NhanVienFinder.get(
          `/danh-sach-nhan-vien-theo-acc/${username}`
        );
        setNhanVien(res.data.data.nhanvien.id);
      } catch (err) {
        console.log(err.message);
      }
    };
    getNhanVien();
  }, [username]);

  const handleSubmit = async (e) => {
    e.stopPropagation();
    if (!khinao) {
      setMsgError("Ngày nghỉ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (dateInPast(new Date(khinao), new Date())) {
      setMsgError("Bạn phải chọn ngày nghỉ sau ngày hôm nay.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (baolau === "--Chọn--") {
      setMsgError("Thời gian nghỉ bạn phải chọn.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!lydo) {
      setMsgError("Lý do nghỉ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await XinNghiFinder.post("/them", {
          khinao: khinao,
          baolau: baolau,
          lydo: lydo,
          nhanvien_id: nhanvien,
        });
        console.log(res);
        if (res.data.status === "ok") {
          ThemLichSu({
            doing: "Viết",
            olddata: {},
            newdata: { new: res.data.data.xinnghi },
            tbl: "Đơn xin nghỉ",
          });
          setMsgDonActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgDonActionSuccess("");
          }, 2500);
          setKhiNao("");
          setLyDo("");
          setBaoLau("--Chọn--");
          hi.push("/quan-ly");
          hi.push("/quan-ly/nhan-vien/xin-nghi");
        } else {
          setMsgError(res.data.status);
          setTimeout(() => {
            setMsgError("");
          }, 3500);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <div>
        <div className="mt-5 mb-2 ">
          <div id="themdonxinnghi">
            <div className="card">
              <div className="card-header" id="xinnghicard">
                <h5 className="mb-0">
                  <div
                    className="text-primary collapsed"
                    data-toggle="collapse"
                    data-target="#formthemdonxinnghi"
                    aria-expanded="false"
                    aria-controls="formthemdonxinnghi"
                    style={{ cursor: "pointer" }}
                  >
                    Xin nghỉ
                  </div>
                </h5>
              </div>
              <div
                id="formthemdonxinnghi"
                className="collapse"
                aria-labelledby="xinnghicard"
                data-parent="#themdonxinnghi"
              >
                <div className="card-body px-5">
                  <form action="">
                    <div className="form-row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="khinaonghi">Khi nào nghỉ</label>
                          <input
                            type="date"
                            id="khinaonghi"
                            className="form-control"
                            onChange={(e) => setKhiNao(e.target.value)}
                            value={khinao}
                            min={new Date() - 1}
                          />
                        </div>
                      </div>

                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="nghibaolau">Nghỉ bao lâu</label>
                          <select
                            onChange={(e) => setBaoLau(e.target.value)}
                            value={baolau}
                            id="nghibaolau"
                            className="form-control"
                          >
                            <option value="--Chọn--" disabled>
                              -- Chọn --
                            </option>
                            <option value="0">Nửa ngày</option>
                            <option value="1">Một ngày</option>
                            <option value="2">Một ngày rưỡi</option>
                            <option value="3">Hai ngày</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-group">
                      <label htmlFor="lydonghi">Lý do nghỉ</label>
                      <textarea
                        id=""
                        rows="4"
                        className="form-control"
                        value={lydo}
                        onChange={(e) => setLyDo(e.target.value)}
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
    </div>
  );
};

export default ThemXinNghi;
