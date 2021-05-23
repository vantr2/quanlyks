import React, { useContext, useEffect, useState } from "react";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import { convertDate } from "../../../utils/DataHandler";
import ThemLichSu from "../../../utils/ThemLichSu";

const SuaPhieuMua = () => {
  let hi = useHistory();
  const [old, setOld] = useState({});
  const { id } = useParams();
  const [ngaymua, setNgayMua] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [idNV, setIDNV] = useState("--Chọn--");

  const [nhanvienFilter, setNhanVienFilter] = useState([]);

  const { setMsgPhieuMuaActionSuccess } = useContext(AccountContext);
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

    const fetchData = async () => {
      try {
        const res = await PhieuMuaFinder.get(`/danh-sach/${id}`);
        const phieumuaSelected = res.data.data.phieumua;
        setNgayMua(convertDate(phieumuaSelected.ngaymua));
        setGhiChu(phieumuaSelected.ghichu);
        setIDNV(phieumuaSelected.idnv);

        setOld({
          id: id,
          ngaymua: convertDate(phieumuaSelected.ngaymua),
          ghichu: phieumuaSelected.ghichu,
          nvtiepnhan: phieumuaSelected.idnv,
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setNhanVienFilter, id]);

  const goBack = () => {
    hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${id}`);
  };

  const handleUpdate = async () => {
    if (!ngaymua) {
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
        const res = await PhieuMuaFinder.put("/sua", {
          id: id,
          ngaymua: ngaymua,
          ghichu: ghichu,
          nvtiepnhan: idNV,
        });
        if (res.data.status === "ok") {
          const newd = {
            id: id,
            ngaymua: ngaymua,
            ghichu: ghichu,
            nvtiepnhan: idNV,
          };

          if (JSON.stringify(old) !== JSON.stringify(newd)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old },
              newdata: { new: newd },
              tbl: "Phiếu mua hàng",
            });
          }
          setMsgPhieuMuaActionSuccess("Sửa thành công.");
          setTimeout(() => {
            setMsgPhieuMuaActionSuccess("");
          }, 2500);
          hi.push(`/quan-ly/ql-hang-hoa/phieu-mua/${id}`);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <form action="" encType="multipart/form-data">
        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="nhacc">Nhân viên tiếp nhận</label>
              <select
                onChange={(e) => {
                  setIDNV(e.target.value);
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

        <p className="text-danger my-2">{msgError}</p>

        <div className="d-flex flex-row">
          <button
            className="btn btn-warning px-4"
            type="button"
            onClick={handleUpdate}
          >
            Sửa
          </button>
          <button className="btn btn-primary ml-3" onClick={goBack}>
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuaPhieuMua;
