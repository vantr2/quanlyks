import React, { useContext, useEffect, useState } from "react";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { useHistory, useParams } from "react-router";
import NormalizeString from "../../../utils/NormalizeString";
import { AccountContext } from "../../../contexts/AccountContext";

const SuaBaoDuong = () => {
  let hi = useHistory();
  const { id } = useParams();

  const [nguoiBd, setNguoiBd] = useState("");
  const [sdt, setSdt] = useState("");
  const [ngaybd, setNgayBd] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [idNV, setIDNV] = useState("--Chọn--");

  const [nhanvienFilter, setNhanVienFilter] = useState([]);

  const { setMsgBaoDuongActionSuccess } = useContext(AccountContext);
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
        const res = await BaoDuongFinder.get(`/danh-sach/${id}`);
        const baoduongSelected = res.data.data.baoduong;
        setNguoiBd(baoduongSelected.nguoibd);
        setSdt(baoduongSelected.sdt);
        setGhiChu(baoduongSelected.ghichu);
        setNgayBd((baoduongSelected.ngaybd + "").substring(0, 10));
        setIDNV(baoduongSelected.idnv);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [setNhanVienFilter, id]);

  const goBack = () => {
    hi.push(`/quan-ly/ql-tai-san/bao-duong/${id}`);
  };
  const handleUpdate = async () => {
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
    } else {
      const res = await BaoDuongFinder.put("/sua", {
        id: id,
        nguoibd: NormalizeString(nguoiBd),
        sdt: sdt,
        ngaybd: ngaybd,
        ghichu: ghichu,
        nvtiepnhan: idNV,
      });
      if (res.data.status === "ok") {
        setMsgBaoDuongActionSuccess("Sửa thành công.");
        setTimeout(() => {
          setMsgBaoDuongActionSuccess("");
        }, 2500);
        hi.push(`/quan-ly/ql-tai-san/bao-duong/${id}`);
      }
    }
  };

  return (
    <div>
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

export default SuaBaoDuong;
