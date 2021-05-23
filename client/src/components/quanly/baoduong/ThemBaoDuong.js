import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import NormalizeString from "../../../utils/NormalizeString";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThemBaoDuong = () => {
  const [nguoiBd, setNguoiBd] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaybd, setNgayBd] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [idNV, setIDNV] = useState("--Chọn--");
  const [tenNV, setTenNV] = useState("");

  const [nhanvienFilter, setNhanVienFilter] = useState([]);

  const { themBaoDuong, setMsgBaoDuongActionSuccess } =
    useContext(AccountContext);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    const filterNhanVien = async () => {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien-kho");
        setNhanVienFilter(res.data.data.nhanvien);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterNhanVien();
  }, []);

  const handleSubmit = async () => {
    if (!nguoiBd) {
      setMsgError("Tên người bảo dưỡng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!sdt) {
      setMsgError("Số điện thoại người bảo dưỡng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (sdt.length < 10 || sdt.length > 11) {
      setMsgError(
        "Số điện thoại người bảo dưỡng không hợp lệ. (di động:10 số, máy bàn 11 số)"
      );
      setTimeout(() => {
        setMsgError("");
      }, 4500);
    } else if (!ngaybd) {
      setMsgError("Ngày bảo dưỡng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!ghichu) {
      setMsgError("Ghi chú không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (idNV === "--Chọn--") {
      setMsgError("Bạn phải chọn nhân viên tiếp nhận.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await BaoDuongFinder.post("/them", {
          nguoibd: NormalizeString(nguoiBd),
          sdt: sdt,
          ngaybd: ngaybd,
          ghichu: ghichu,
          nvtiepnhan: idNV,
        });
        if (res.data.status === "ok") {
          const baoduongInserted = res.data.data.baoduong;
          ThemLichSu({
            doing: "Thêm",
            olddata: {},
            newdata: { new: baoduongInserted },
            tbl: "Phiếu bảo dưỡng",
          });

          const baoduongContext = {
            id: baoduongInserted.id,
            nguoibd: baoduongInserted.nguoibd,
            sdt: baoduongInserted.sdt,
            ngaybd: baoduongInserted.ngaybd,
            ghichu: baoduongInserted.ghichu,
            tongtien: baoduongInserted.tongtien,
            idnv: baoduongInserted.nvtiepnhan,
            tennv: tenNV,
          };
          themBaoDuong(baoduongContext);
          setMsgBaoDuongActionSuccess("Thêm thành công.");
          setTimeout(() => {
            setMsgBaoDuongActionSuccess("");
          }, 2500);
          setNgayBd("");
          setNguoiBd("");
          setSdt("");
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
        <div id="thembaoduong">
          <div className="card">
            <div className="card-header" id="baoduongcard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthembaoduong"
                  aria-expanded="false"
                  aria-controls="formthembaoduong"
                  style={{ cursor: "pointer" }}
                >
                  Thêm bảo dưỡng tài sản
                </div>
              </h5>
            </div>
            <div
              id="formthembaoduong"
              className="collapse"
              aria-labelledby="baoduongcard"
              data-parent="#thembaoduong"
            >
              <div className="card-body px-5">
                <form action="" encType="multipart/form-data">
                  <div className="form-group">
                    <label htmlFor="nguoibd">Tên người bảo dưỡng</label>
                    <input
                      type="text"
                      id="nguoibd"
                      className="form-control"
                      value={nguoiBd}
                      onChange={(e) => setNguoiBd(e.target.value)}
                    />
                  </div>
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="sdtnguoibd">Số điện thoại</label>
                        <input
                          type="number"
                          min="0"
                          id="sdtnguoibd"
                          className="form-control"
                          value={sdt}
                          onChange={(e) => setSdt(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="ngaybd">Ngày bảo dưỡng</label>
                        <input
                          type="date"
                          id="ngaybd"
                          className="form-control"
                          onChange={(e) => setNgayBd(e.target.value)}
                          value={ngaybd}
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

export default ThemBaoDuong;
