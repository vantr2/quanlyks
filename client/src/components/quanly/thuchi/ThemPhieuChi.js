import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import ThuChiFinder from "../../../apis/ThuChiFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { useHistory } from "react-router";
import CurrencyInput from "react-currency-input-field";
const ThemPhieuChi = () => {
  let hi = useHistory();
  const [khoanchi, setKhoanChi] = useState("");
  const [ngaychi, setNgayChi] = useState("");
  const [nguoichi, setNguoiChi] = useState("");
  const [tienchi, setTienChi] = useState("");
  const [msgE, setMsgE] = useState("");

  const [dsNvQl, setDsNvQl] = useState([]);

  const { setMsgPhieuChiActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const filterNVQl = async () => {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien-ql");
        setDsNvQl(res.data.data.nhanvien);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterNVQl();
  }, []);

  const handleInsert = async () => {
    if (!khoanchi) {
      setMsgE("Tên khoản chi không được để trống.");
      setTimeout(() => {
        setMsgE("");
      }, 3000);
    } else if (!ngaychi) {
      setMsgE("Ngày chi không được để trống.");
      setTimeout(() => {
        setMsgE("");
      }, 3000);
    } else if (!nguoichi) {
      setMsgE("Người tiếp nhận phải được chọn.");
      setTimeout(() => {
        setMsgE("");
      }, 3000);
    } else if (!tienchi) {
      setMsgE("Tiền chi không được để trống.");
      setTimeout(() => {
        setMsgE("");
      }, 3000);
    } else {
      try {
        const res = await ThuChiFinder.post("/phieu-chi", {
          khoanchi,
          ngaychi,
          nguoichi,
          tienchi,
        });
        if (res.data.status === "ok") {
          setMsgPhieuChiActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgPhieuChiActionSuccess("");
            hi.push("/quan-ly");
            hi.push("/quan-ly/thu-chi/phieu-chi");
          }, 1000);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="themphieuchi">
          <div className="card">
            <div className="card-header" id="phieuchicard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthemphieuchi"
                  aria-expanded="false"
                  aria-controls="formthemphieuchi"
                  style={{ cursor: "pointer" }}
                >
                  Thêm phiếu chi
                </div>
              </h5>
            </div>
            <div
              id="formthemphieuchi"
              className="collapse"
              aria-labelledby="phieuchicard"
              data-parent="#themphieuchi"
            >
              <div className="card-body px-5">
                <form action="">
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="khoanchi">Tên khoản chi</label>
                        <input
                          type="text"
                          id="khoanchi"
                          className="form-control"
                          value={khoanchi}
                          onChange={(e) => setKhoanChi(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="ngaychi">Ngày chi</label>
                        <input
                          type="date"
                          id="ngaychi"
                          className="form-control"
                          onChange={(e) => setNgayChi(e.target.value)}
                          value={ngaychi}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="nguoichi">Người tiếp nhận</label>
                        <select
                          onChange={(e) => setNguoiChi(e.target.value)}
                          value={nguoichi}
                          id="nguoichi"
                          className="form-control"
                        >
                          <option value="" disabled>
                            -- Chọn --
                          </option>
                          {dsNvQl.map((nv) => {
                            return (
                              <option key={nv.id} value={nv.id}>
                                {nv.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="tienchi">Tiền chi</label>
                        <CurrencyInput
                          id="tienchi"
                          value={tienchi}
                          className="form-control text-right"
                          suffix=" đồng"
                          groupSeparator="."
                          onValueChange={(value) => {
                            setTienChi(value);
                          }}
                          step="1000"
                          maxLength="9"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary py-2 px-4"
                    onClick={handleInsert}
                  >
                    Thêm
                  </button>
                  <p className="text-danger my-2">{msgE}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemPhieuChi;
