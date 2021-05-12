import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";

const ThemPhieuMua = () => {
  const [ngaymua, setNgayMua] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [idNV, setIDNV] = useState("--Chọn--");
  const [tenNV, setTenNV] = useState("");

  const [nhanvienFilter, setNhanVienFilter] = useState([]);

  const { themPhieuMua, setMsgPhieuMuaActionSuccess } =
    useContext(AccountContext);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    const filterNhanVien = async () => {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien");
        setNhanVienFilter(res.data.data.nhanvien);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterNhanVien();
  }, []);

  const handleSubmit = async () => {
    if (idNV === "--Chọn--") {
      setMsgError("Bạn phải chọn nhân viên tiếp nhận.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!ngaymua) {
      setMsgError("Ngày mua không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!ghichu) {
      setMsgError("Ghi chú không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await PhieuMuaFinder.post("/them", {
          ngaymua: ngaymua,
          ghichu: ghichu,
          nvtiepnhan: idNV,
        });
        console.log(res);
        if (res.data.status === "ok") {
          const phieumuaInserted = res.data.data.phieumua;
          const phieumuaContext = {
            id: phieumuaInserted.id,
            ngaymua: phieumuaInserted.ngaymua,
            tongtien: phieumuaInserted.tongtien,
            ghichu: phieumuaInserted.ghichu,
            idnv: phieumuaInserted.nvtiepnhan,
            tennv: tenNV,
          };
          console.log(phieumuaInserted);
          themPhieuMua(phieumuaContext);
          setMsgPhieuMuaActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgPhieuMuaActionSuccess("");
          }, 2500);
          setNgayMua("");
          setGhiChu("");
          setIDNV("--Chọn--");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="themphieumua">
          <div className="card">
            <div className="card-header" id="phieumuacard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthemphieumua"
                  aria-expanded="false"
                  aria-controls="formthemphieumua"
                  style={{ cursor: "pointer" }}
                >
                  Thêm phiếu mua
                </div>
              </h5>
            </div>
            <div
              id="formthemphieumua"
              className="collapse"
              aria-labelledby="phieumuacard"
              data-parent="#themphieumua"
            >
              <div className="card-body px-5">
                <form action="" encType="multipart/form-data">
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="nhacc">Nhân viên tiếp nhận</label>
                        <select
                          onChange={(e) => {
                            setIDNV(e.target.value);
                            let index = e.nativeEvent.target.selectedIndex;
                            setTenNV(e.nativeEvent.target[index].text);
                          }}
                          value={idNV}
                          id="nhacc"
                          className="form-control"
                        >
                          <option value="--Chọn--" disabled>
                            -- Chọn --
                          </option>
                          {nhanvienFilter.map((nhanvien) => {
                            return (
                              <option key={nhanvien.id} value={nhanvien.id}>
                                {nhanvien.name}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="ngaymua">Ngày mua</label>
                        <input
                          type="date"
                          id="ngaymua"
                          className="form-control"
                          onChange={(e) => setNgayMua(e.target.value)}
                          value={ngaymua}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ghichu">Ghi chú</label>
                    <textarea
                      className="form-control"
                      id="ghichu"
                      rows="3"
                      value={ghichu}
                      onChange={(e) => setGhiChu(e.target.value)}
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

export default ThemPhieuMua;
