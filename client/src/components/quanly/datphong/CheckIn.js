import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import KhachHangFinder from "../../../apis/KhachHangFinder";
import PhongFinder from "../../../apis/PhongFinder";
import {
  NormalizeDate,
  convertTime,
  NumberFormat,
} from "../../../utils/DataHandler";
import ThemLichSu from "../../../utils/ThemLichSu";
import DoiPhong from "./doihuy/DoiPhong";
import HuyPhong from "./doihuy/HuyPhong";
const CheckIn = () => {
  const { phongid } = useParams();
  let hi = useHistory();
  const [dpSelected, setDpSelected] = useState([]);

  const [tenKh, setTenKh] = useState("");
  const [cmndKH, setCmndKh] = useState("");
  const [sdtKh, setSdtKh] = useState("");
  const [khId, setKhId] = useState("");
  const [dpId, setDpId] = useState("");
  const [msgError, setMsgError] = useState("");

  const [old, setOld] = useState({});
  useEffect(() => {
    const getDatPhong = async () => {
      try {
        const res = await DatPhongFinder.get(`/danh-sach/${phongid}`);
        if (res.data.status) {
          setDpSelected(res.data.data.datphong);
          const datPhongSelected = res.data.data.datphong;
          setTenKh(datPhongSelected.kh_name);
          setCmndKh(datPhongSelected.kh_cmnd);
          setSdtKh(datPhongSelected.kh_sdt);
          setKhId(datPhongSelected.kh_id);
          setDpId(datPhongSelected.id);
          setOld({
            id: datPhongSelected.kh_id,
            ten: datPhongSelected.kh_name,
            cmnd: datPhongSelected.kh_cmnd,
            sdt: datPhongSelected.kh_sdt,
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getDatPhong();
  }, [phongid]);

  const goBack = () => {
    hi.push("/quan-ly/phong/tinh-trang");
  };

  const handleSave = async () => {
    if (!tenKh) {
      setMsgError("Tên khách hàng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
      //
    } else if (!cmndKH) {
      setMsgError("Chứng minh nhân dân không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
      //
    } else if (cmndKH.length !== 12) {
      setMsgError("Chứng minh nhân dân không hợp lệ. (gồm 12 số). ");
      setTimeout(() => {
        setMsgError("");
      }, 3500);
    } else if (!sdtKh) {
      setMsgError("Số điện thoại không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
      //
    } else if (sdtKh.length < 10 || sdtKh.length > 11) {
      setMsgError(
        "Số điện thoại không hợp lệ. (gồm 10 số với di động, 11 số với máy bàn)."
      );
      setTimeout(() => {
        setMsgError("");
      }, 5000);
    } else {
      try {
        const res = await KhachHangFinder.put("/sua-checkin", {
          id: khId,
          ten: tenKh,
          cmnd: cmndKH,
          sdt: sdtKh,
        });
        if (res.data.status === "ok") {
          const newd = {
            id: khId,
            ten: tenKh,
            cmnd: cmndKH,
            sdt: sdtKh,
          };

          if (JSON.stringify(newd) !== JSON.stringify(old)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old },
              newdata: {
                new: newd,
              },
              tbl: "Khách hàng",
            });
          }
          hi.push("/quan-ly/phong/tinh-trang");
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleCheckIn = async () => {
    if (!tenKh) {
      setMsgError("Tên khách hàng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
      //
    } else if (!cmndKH) {
      setMsgError("Chứng minh nhân dân không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
      //
    } else if (cmndKH.length !== 12) {
      setMsgError("Chứng minh nhân dân không hợp lệ. (gồm 12 số). ");
      setTimeout(() => {
        setMsgError("");
      }, 3500);
    } else if (!sdtKh) {
      setMsgError("Số điện thoại không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
      //
    } else if (sdtKh.length < 10 || sdtKh.length > 11) {
      setMsgError(
        "Số điện thoại không hợp lệ. (gồm 10 số với di động, 11 số với máy bàn)."
      );
      setTimeout(() => {
        setMsgError("");
      }, 5000);
    } else {
      try {
        await KhachHangFinder.put("/sua-checkin", {
          id: khId,
          ten: tenKh,
          cmnd: cmndKH,
          sdt: sdtKh,
        });
        const newd = {
          id: khId,
          ten: tenKh,
          cmnd: cmndKH,
          sdt: sdtKh,
        };

        if (JSON.stringify(newd) !== JSON.stringify(old)) {
          ThemLichSu({
            doing: "Sửa",
            olddata: { old },
            newdata: {
              new: newd,
            },
            tbl: "Khách hàng",
          });
        }

        await DatPhongFinder.put("/check-in", {
          id: dpId,
        });
        ThemLichSu({
          doing: "Check In",
          olddata: {},
          newdata: {},
          tbl: "Phòng",
        });

        await PhongFinder.put("/update-tt", {
          ten: phongid,
          trangthai: 2,
        });

        hi.push(`/quan-ly/phong/tinh-trang/${phongid}/su-dung-dich-vu`);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="mt-5">
      <h1 className="text-center mb-5">THÔNG TIN ĐẶT PHÒNG</h1>

      <div className="form-row">
        <div className="col-6">
          <div className="form-group">
            <label htmlFor="tenkh">Tên khách hàng</label>
            <input
              type="text"
              id="tenkh"
              className="form-control"
              value={tenKh}
              onChange={(e) => setTenKh(e.target.value)}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="cmnd">Chứng minh nhân dân</label>
            <input
              type="text"
              className="form-control"
              id="cmnd"
              onChange={(e) => setCmndKh(e.target.value)}
              value={cmndKH}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="sdt">Số điện thoại</label>
            <input
              type="text"
              className="form-control"
              id="sdt"
              onChange={(e) => setSdtKh(e.target.value)}
              value={sdtKh}
            />
          </div>
        </div>
      </div>
      <p className="text-danger">{msgError}</p>
      <div className="d-flex flex-row">
        <button className="btn btn-primary  mt-3 mr-2" onClick={handleCheckIn}>
          Check In
        </button>
        <button className="btn btn-info px-4 mt-3 mr-2" onClick={handleSave}>
          Lưu
        </button>
        <button className="btn btn-secondary mt-3" onClick={goBack}>
          Quay lại
        </button>
        <DoiPhong phongid={phongid} dpid={dpId} />
        <HuyPhong phongid={phongid} dpid={dpId} tiencoc={dpSelected.tiencoc} />
      </div>

      <h4 className="mt-3 mb-3">PHÒNG : {dpSelected.phong_id}</h4>
      <table className="table table-striped table-hover table-bordered mb-5">
        <tbody>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Hình thức đặt phòng</td>
            <td className="col-9 pl-2">{dpSelected.hinhthucdp}</td>
          </tr>
          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Ngày đặt phòng</td>
            <td className="col-9 pl-2">
              {" "}
              Ngày: {NormalizeDate(dpSelected.ngaydat)}, lúc{" "}
              {convertTime(dpSelected.ngaydat)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Check In</td>
            <td className="col-9 pl-2">
              {" "}
              Ngày: {NormalizeDate(dpSelected.checkin)}, lúc{" "}
              {convertTime(dpSelected.checkin)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Check out</td>
            <td className="col-9 pl-2">
              {" "}
              Ngày: {NormalizeDate(dpSelected.checkout)}, lúc{" "}
              {convertTime(dpSelected.checkout)}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Nhân viên tiếp nhận</td>
            <td className="col-9 pl-2">{dpSelected.nv}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Hình thức thuê</td>
            <td className="col-9 pl-2">{dpSelected.kieuthue}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Giá thuê </td>
            <td className="col-9 pl-2">
              {NumberFormat(dpSelected.giathue)} VND /{" "}
              {dpSelected.kieuthue === "Thuê theo ngày"
                ? "ngày"
                : dpSelected.kieuthue === "Thuê theo ngày"
                ? "giờ"
                : "đêm"}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">
              Số{" "}
              {dpSelected.kieuthue === "Thuê theo ngày"
                ? "ngày"
                : dpSelected.kieuthue === "Thuê theo ngày"
                ? "giờ"
                : "đêm"}{" "}
              thuê{" "}
            </td>
            <td className="col-9 pl-2">
              {dpSelected.sotgthue}&nbsp;
              {dpSelected.kieuthue === "Thuê theo ngày"
                ? "ngày"
                : dpSelected.kieuthue === "Thuê theo ngày"
                ? "giờ"
                : "đêm"}
            </td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Nhân viên tiếp nhận</td>
            <td className="col-9 pl-2">{dpSelected.nv}</td>
          </tr>

          <tr className="d-flex">
            <td className="col-3 pl-2 font-weight-bold">Tiền cọc</td>
            <td className="col-9 pl-2">
              {NumberFormat(dpSelected.tiencoc)} VND
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CheckIn;
