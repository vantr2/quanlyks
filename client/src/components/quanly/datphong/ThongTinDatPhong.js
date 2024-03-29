import React, { useContext, useEffect, useState } from "react";
// import DateTimePicker from "react-datetime-picker";
import CurrencyInput from "react-currency-input-field";
import { AccountContext } from "../../../contexts/AccountContext";
import PhongFinder from "../../../apis/PhongFinder";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { useParams, useHistory } from "react-router";
import {
  convertDate,
  convertTime,
  isWeekend,
} from "../../../utils/DataHandler";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThongTinDatPhong = () => {
  let hi = useHistory();

  const user_name = window.localStorage.getItem("user_name");
  const user_displayname = window.localStorage.getItem("user_displayname");

  const [htdatphong, setHtDatPhong] = useState("Trực tiếp");
  const [checkin, setCheckIn] = useState("");
  const [checkout, setCheckOut] = useState("");
  const [htthue, setHtThue] = useState("");
  const [giathue, setGiaThue] = useState("");
  const [sotgThue, setSoTgThue] = useState("1");
  const [tiencoc, setTienCoc] = useState("");
  const [nv, setNV] = useState("");
  const [msgError, setMsgError] = useState("");

  const { khID } = useContext(AccountContext);
  const [thuetheongay, setThueTheoNgay] = useState("d-none");
  const [thuetheogio, setThueTheoGio] = useState("d-none");
  const [dngayle, setDNgayLe] = useState("d-none");

  const [phongSelected, setPhongSelected] = useState([]);
  const { phongid } = useParams();

  const [disableSotgthue, setDisableSotgThue] = useState(false);
  const [ngayle, setNgayLe] = useState(false);

  useEffect(() => {
    const getPhong = async () => {
      try {
        const res = await PhongFinder.get(`/danh-sach-phong/${phongid}`);
        if (res.data.status === "ok") {
          setPhongSelected(res.data.data.phong);
        }
      } catch (er) {
        console.log(er.message);
      }
    };

    const getNhanVien = async () => {
      try {
        const res = await NhanVienFinder.get(
          `/danh-sach-nhan-vien-theo-acc/${user_name}`
        );
        if (res.data.status === "ok") {
          if (res.data.data.nhanvien) {
            setNV(res.data.data.nhanvien.name);
          } else {
            setNV(user_displayname);
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    getNhanVien();
    getPhong();
  }, [phongid, setPhongSelected, user_name, setNV, user_displayname]);

  const handleChangeHtThue = (e) => {
    if (checkin && checkout) {
      setHtThue(e.target.value);
      const wk = isWeekend(checkin, checkout);
      const wkgia = wk === 1 ? 1.4 : wk === 2 ? 1.55 : 1;
      if (e.target.value === "Thuê theo ngày") {
        setThueTheoNgay("");
        setSoTgThue("1");
        setDisableSotgThue(false);
        setThueTheoGio("d-none");
        setDNgayLe("");
        let giaphong = phongSelected.giaphongtheongay * wkgia;
        setGiaThue(giaphong);
        let tc = parseInt(giaphong / 5);
        setTienCoc(Math.round(tc / 1000) * 1000);
      } else if (e.target.value === "Thuê theo đêm") {
        setThueTheoNgay("");
        setSoTgThue("1");
        setDisableSotgThue(true);
        setThueTheoGio("d-none");
        setDNgayLe("");
        let giaphong = phongSelected.giaphongtheongay * 0.65 * wkgia;
        setGiaThue(giaphong);
        let tc = parseInt(giaphong / 5);
        setTienCoc(Math.round(tc / 1000) * 1000);
      } else if (e.target.value === "Thuê theo giờ") {
        setThueTheoGio("");
        setSoTgThue("1");
        setThueTheoNgay("d-none");
        setDisableSotgThue(false);
        setDNgayLe("");
        let giaphong = phongSelected.giaphongtheogio * wkgia;
        setGiaThue(giaphong);
        let tc = parseInt(giaphong / 5);
        setTienCoc(Math.round(tc / 1000) * 1000);
      } else {
        setDisableSotgThue(false);
        setNgayLe(false);
        setThueTheoNgay("d-none");
        setThueTheoGio("d-none");
        setDNgayLe("d-none");
        setGiaThue("");
        setSoTgThue("");
        setTienCoc("");
        setGiaThue("");
      }
    } else {
      setMsgError("Bạn nên chọn thời gian nhận, trả phòng trước.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    }
  };

  const goBack = () => {
    hi.push("/quan-ly/phong/tinh-trang");
  };

  const handleOpenRoom = async () => {
    if (khID === "") {
      setMsgError("Bạn phải chọn khách hàng để thực hiện đặt phòng.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (!checkin) {
      setMsgError("Ngày-giờ Check-in không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (!checkout) {
      setMsgError("Ngày-giờ Check-out không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (htthue === "") {
      setMsgError("Hình thức thuê không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (
      htthue === "Thuê theo ngày" &&
      sotgThue <
        Math.floor(
          (new Date(checkout) - new Date(checkin)) / (1000 * 3600 * 24)
        )
    ) {
      setMsgError("Số ngày thuê không hợp lệ. (trước khi checkout)");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (
      htthue === "Thuê theo đêm" &&
      new Date(checkin).getHours() < 18
    ) {
      setMsgError("Sau 6h tối mới được tính vào thuê đêm. ");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (
      htthue === "Thuê theo đêm" &&
      sotgThue + "" !==
        (new Date(checkout) - new Date(checkin)) / (1000 * 3600 * 12) + ""
    ) {
      setMsgError("Thời gian thuê theo đêm không hợp lệ, (12 tiếng)");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (
      htthue === "Thuê theo giờ" &&
      sotgThue <
        Math.floor((new Date(checkout) - new Date(checkin)) / (1000 * 3600))
    ) {
      setMsgError("Số giờ thuê không hợp lệ. (trước khi checkout)");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (!giathue) {
      setMsgError("Giá thuê không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else if (!tiencoc) {
      setMsgError("Tiền cọc không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 4000);
    } else {
      try {
        let giaquakiemduyet;
        giaquakiemduyet = ngayle ? parseInt(giathue) * 1.6 + "" : giathue;

        const res = await DatPhongFinder.post("/them", {
          khachhang_id: khID,
          hinhthucdp: htdatphong,
          checkin: convertDate(checkin) + " " + convertTime(checkin) + "-07",
          checkout: convertDate(checkout) + " " + convertTime(checkout) + "-07",
          phong_id: phongid,
          kieuthue: htthue,
          giathue: giaquakiemduyet,
          sotgthue: sotgThue,
          nv: nv,
          tongtien: 0,
          trangthai: 1,
          tiencoc: tiencoc,
        });
        if (res.data.status === "ok") {
          if (res.data.data.datphong) {
            ThemLichSu({
              doing: "Mở",
              olddata: {},
              newdata: { new: res.data.data.datphong },
              tbl: "Đặt phòng",
            });
            const r = await PhongFinder.put("/update-tt", {
              ten: phongid,
              trangthai: 1,
            });
            if (r.data.status === "ok") {
              hi.push(`/quan-ly/phong/tinh-trang/${phongid}/checkin`);
            }
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <h3 className="text-center">Thông tin đặt phòng</h3>

      <form className="mt-5">
        <h5 className="form-group">PHÒNG THUÊ : {phongid}</h5>
        <div className="form-group input-group">
          <div className="input-group-prepend">
            <label htmlFor="htdatphong" className="input-group-text">
              Hình thức đặt phòng:{" "}
            </label>
          </div>
          <select
            id="htdatphong"
            className="custom-select"
            value={htdatphong}
            onChange={(e) => setHtDatPhong(e.target.value)}
          >
            <option value="Trực tiếp">Trực tiếp</option>
            <option value="Online">Online</option>
            <option value="Gọi điện">Gọi điện</option>
          </select>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="checkin">Check In</label>

              <input
                className="form-control"
                type="datetime-local"
                id="checkin"
                value={checkin}
                onChange={(e) => {
                  setHtThue("");
                  setDNgayLe("d-none");
                  setNgayLe(false);
                  setDisableSotgThue(false);
                  setThueTheoNgay("d-none");
                  setThueTheoGio("d-none");
                  setGiaThue("");
                  setSoTgThue("");
                  setTienCoc("");
                  setGiaThue("");
                  const today = new Date();
                  if (new Date(e.target.value) - today > 0)
                    setCheckIn(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="checkout">Check Out</label>

              <input
                className="form-control"
                type="datetime-local"
                id="chekout-date"
                value={checkout}
                onChange={(e) => {
                  setHtThue("");
                  setDNgayLe("d-none");
                  setNgayLe(false);
                  setDisableSotgThue(false);
                  setThueTheoNgay("d-none");
                  setThueTheoGio("d-none");
                  setGiaThue("");
                  setSoTgThue("");
                  setTienCoc("");
                  setGiaThue("");
                  if (!checkin) {
                    setMsgError("Bạn nên chọn thời gian nhận phòng trước.");
                    setTimeout(() => {
                      setMsgError("");
                    }, 3000);
                  } else {
                    if (
                      new Date(e.target.value) - new Date(checkin) >=
                      2 * 3600 * 1000
                    )
                      setCheckOut(e.target.value);
                    else {
                      setMsgError(
                        "Bạn nên chọn thời gian trả phòng sau 2 giờ kể từ thời điểm nhận phòng."
                      );
                      setTimeout(() => {
                        setMsgError("");
                      }, 3000);
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="htthue">Hình thức thuê</label>
          <select
            id="htthue"
            className="form-control"
            value={htthue}
            onChange={(e) => handleChangeHtThue(e)}
          >
            <option value="">-- Chọn --</option>
            <option value="Thuê theo ngày">Theo ngày</option>
            <option value="Thuê theo giờ">Theo giờ</option>
            <option value="Thuê theo đêm">Theo đêm</option>
          </select>
        </div>

        <div className={`form-row ${thuetheongay}`}>
          <div className="col">
            <div className="form-group">
              <label htmlFor="giathuetheongay">Giá thuê theo ngày</label>
              <CurrencyInput
                id="giathuetheongay"
                value={giathue}
                className="form-control text-right"
                suffix=" đồng"
                groupSeparator="."
                onValueChange={(value) => {
                  setGiaThue(value);
                }}
                step="1000"
                maxLength="9"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="songaythue">Số ngày thuê</label>
              <input
                type="number"
                id="songaythue"
                disabled={disableSotgthue}
                className="form-control"
                value={sotgThue}
                min="1"
                max="100"
                onChange={(e) => {
                  setSoTgThue(e.target.value);
                  let tc = (parseInt(e.target.value) * parseInt(giathue)) / 5;
                  setTienCoc(Math.round(tc / 1000) * 1000);
                }}
              />
            </div>
          </div>
        </div>
        <div className={`form-row ${thuetheogio}`}>
          <div className="col">
            <div className="form-group">
              <label htmlFor="giathuetheogio">Giá thuê theo giờ</label>
              <CurrencyInput
                id="giathuetheogio"
                value={giathue}
                className="form-control text-right"
                suffix=" đồng"
                groupSeparator="."
                onValueChange={(value) => {
                  setGiaThue(value);
                }}
                step="1000"
                maxLength="9"
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="sogiothue">Số giờ thuê</label>
              <input
                type="number"
                id="sogiothue"
                className="form-control"
                value={sotgThue}
                min="1"
                max="24"
                onChange={(e) => {
                  setSoTgThue(e.target.value);
                  let tc = (parseInt(e.target.value) * parseInt(giathue)) / 5;
                  setTienCoc(Math.round(tc / 1000) * 1000);
                }}
              />
            </div>
          </div>
        </div>
        <div className={`form-check ${dngayle} mb-3`}>
          <input
            type="checkbox"
            className="form-check-input"
            id="ngayle"
            value={ngayle}
            onChange={(e) => setNgayLe(e.target.checked)}
          />
          <label className="form-check-label" for="ngayle">
            Ngày lễ
          </label>
        </div>
        <div className="form-group">
          <label htmlFor="tiencoc">Tiền cọc (20% tiền phòng)</label>
          <CurrencyInput
            id="tiencoc"
            value={tiencoc}
            className="form-control text-right"
            suffix=" đồng"
            groupSeparator="."
            onValueChange={(value) => {
              setTienCoc(value);
            }}
            step="1000"
            maxLength="9"
          />
        </div>
        <p className="text-danger">{msgError}</p>

        <div className="d-flex flex-row">
          <div className=" ">
            <button
              type="button"
              className="btn btn-primary "
              onClick={handleOpenRoom}
            >
              Mở phòng
            </button>

            <button
              type="button"
              className="btn btn-secondary ml-2 px-3"
              onClick={goBack}
            >
              Quay lại
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ThongTinDatPhong;
