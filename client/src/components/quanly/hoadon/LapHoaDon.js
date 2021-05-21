import React, { useEffect, useState } from "react";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import KhachHangFinder from "../../../apis/KhachHangFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import PhongFinder from "../../../apis/PhongFinder";
import CurrencyInput from "react-currency-input-field";
import MultiSelect from "react-multi-select-component";
import { useHistory } from "react-router";

const LapHoaDon = () => {
  let hi = useHistory();
  const [khId, setKhId] = useState("");
  const [nvId, setNvId] = useState("");
  const [vat, setVat] = useState("10");
  const [hinhthuctt, setHinhThucTT] = useState("1");

  const [msgError, setMsgError] = useState("");
  const [msgSuccess, setMsgSuccess] = useState("");

  const [dsKhachHang, setDsKhachHang] = useState([]);
  const [dsNhanVien, setDsNhanVien] = useState([]);
  const [disableDSDP, setDisableDSDP] = useState(true);

  const [optitionsDP, setOptionsDP] = useState([]);

  const [dpsSelected, setDpsSelected] = useState([]);

  useEffect(() => {
    const getListKH = async () => {
      try {
        const res = await KhachHangFinder.get("/danh-sach");
        setDsKhachHang(res.data.data.khachhang);
        //   setKHID("");
      } catch (err) {
        console.log(err.message);
      }
    };
    getListKH();

    const getListNV = async () => {
      try {
        const res = await NhanVienFinder.get(
          "/danh-sach-nhan-vien-lap-hoa-don"
        );
        // console.log(res.data.data.nhanvien);
        setDsNhanVien(res.data.data.nhanvien);
        //   setKHID("");
      } catch (err) {
        console.log(err.message);
      }
    };
    getListNV();
  }, []);

  const tinhTienPhat = (co, khco, thanhtien) => {
    let tienphat;
    const datediff = new Date(co) - new Date(khco);
    if (datediff >= 0) {
      tienphat = 0;
    } else if (datediff < 0 && datediff >= -(3600 * 1000)) {
      tienphat = thanhtien / 50; // 2%
    } else if (datediff < -(3600 * 1000) && datediff >= -(3600 * 1000 * 2)) {
      tienphat = thanhtien / 20; // 5%
    } else if (
      datediff < -(3600 * 1000 * 2) &&
      datediff >= -(3600 * 1000 * 6)
    ) {
      tienphat = thanhtien / 10; // 10%
    } else if (
      datediff < -(3600 * 1000 * 6) &&
      datediff >= -(3600 * 1000 * 24)
    ) {
      tienphat = (thanhtien * 15) / 100; // 15%
    } else if (datediff < -(3600 * 1000 * 24)) {
      tienphat = thanhtien / 4; // 25%
    }
    return tienphat;
  };
  const handleSubmit = async () => {
    if (!khId) {
      setMsgError("Khách hàng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!nvId) {
      setMsgError("Người lập phiếu không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!vat) {
      setMsgError("Thuế giá trị gia tăng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (dpsSelected.length === 0) {
      setMsgError("Danh sách đặt phòng không được để trống");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await HoaDonFinder.post("/them", {
          nv: nvId,
          khachhang_id: khId,
          hinhthuctt: hinhthuctt,
          vat: vat,
        });
        if (res.data.status === "ok") {
          const hoadon_id_inserted = res.data.data.hoadon.id;
          dpsSelected.forEach(async (item) => {
            const res_dpchitiet = await DatPhongFinder.get(
              `danh-sach-full/${item.value}`
            );
            const dp = res_dpchitiet.data.data.datphong;

            const tienphong = parseInt(dp.giathue) * parseInt(dp.sotgthue);
            let tienphat = tinhTienPhat(dp.checkout, dp.kh_checkout, tienphong);
            const tongtien = parseInt(dp.tongtien) + tienphong;
            const tiencoc = dp.tiencoc;

            const res_hdchitiet = await HoaDonFinder.post("/them-chi-tiet", {
              hoadon_id: hoadon_id_inserted,
              datphong_id: item.value,
              tienphat: tienphat,
              tongtien: tongtien, // tong tiên phong và su dung dich vu
              tiencoc: tiencoc,
            });
            if (res_hdchitiet.data.status === "ok") {
              await PhongFinder.put("/update-tt", {
                ten: item.label,
                trangthai: 4,
              });
              setMsgSuccess("Thêm thành công.");
              setTimeout(() => {
                setMsgSuccess("");
                hi.push("/quan-ly");
                hi.push("/quan-ly/phong/hoa-don");
              }, 2000);
            }
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleChangeDsKH = async (e) => {
    setKhId(e.target.value);
    try {
      const res = await DatPhongFinder.get(
        `/danh-sach-theo-kh/${e.target.value}`
      );
      if (res.data.data.datphong.length === 0) {
        setMsgError("Khách hàng này không đặt phòng nào, Mời chọn lại");
        setTimeout(() => {
          setMsgError("");
        }, 3000);
        setDisableDSDP(true);
      } else {
        setDpsSelected([]);
        setDisableDSDP(false);
        const options = [];
        res.data.data.datphong.forEach((item) => {
          const option = {
            label: item.phong_id,
            value: item.id + "",
            disabled: item.tt_phong === 3 ? false : true,
          };
          options.push(option);
        });
        setOptionsDP(options);
      }
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div>
      <div>
        <div className="mt-5 mb-2 ">
          <div id="laphoadon">
            <div className="card">
              <div className="card-header" id="hoadoncard">
                <h5 className="mb-0">
                  <div
                    className="text-primary collapsed"
                    data-toggle="collapse"
                    data-target="#formlaphoadon"
                    aria-expanded="false"
                    aria-controls="formlaphoadon"
                    style={{ cursor: "pointer" }}
                  >
                    Lập hóa đơn
                  </div>
                </h5>
              </div>
              <div
                id="formlaphoadon"
                className="collapse"
                aria-labelledby="hoadoncard"
                data-parent="#laphoadon"
              >
                <div className="card-body px-5">
                  <form action="">
                    <div className="form-row">
                      <div className="col-6">
                        <div className="input-group-prepend form-group">
                          <label
                            className="input-group-text"
                            htmlFor="dskhachhang"
                          >
                            Khách hàng
                          </label>
                          <select
                            id="dskhachhang"
                            value={khId}
                            className="custom-select"
                            onChange={(e) => handleChangeDsKH(e)}
                          >
                            <option value="" disabled>
                              --Chọn--
                            </option>
                            {dsKhachHang.map((kh) => {
                              return (
                                <option value={kh.id} key={kh.id}>
                                  {kh.ten} - {kh.cmnd} - {kh.sdt}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="input-group-prepend form-group">
                          <label
                            className="input-group-text"
                            htmlFor="dsnhanvien"
                          >
                            Người lập phiếu
                          </label>
                          <select
                            id="dsnhanvien"
                            value={nvId}
                            className="custom-select"
                            onChange={(e) => setNvId(e.target.value)}
                          >
                            <option value="" disabled>
                              --Chọn--
                            </option>
                            {dsNhanVien.map((nv) => {
                              return (
                                <option value={nv.id} key={nv.id}>
                                  {nv.name} - {nv.sdt} - {nv.account}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="hinhthuctt">
                            Hình thức thanh toán
                          </label>
                          <select
                            type="text"
                            className="form-control"
                            value={hinhthuctt}
                            id="hinhthuctt"
                            onChange={(e) => setHinhThucTT(e.target.value)}
                          >
                            <option value="1">Tiền mặt</option>
                            <option value="2">Chuyển khoản</option>
                          </select>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-group">
                          <label htmlFor="vat">Thuế giá trị gia tăng (%)</label>
                          <CurrencyInput
                            id="vat"
                            value={vat}
                            decimalSeparator=","
                            precision="2"
                            className="form-control text-right"
                            suffix=" %"
                            onValueChange={(value) => {
                              setVat(value);
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className=" form-group">
                      <label htmlFor="dsdatphong">Danh sách đặt phòng</label>
                      <MultiSelect
                        disabled={disableDSDP}
                        options={optitionsDP}
                        value={dpsSelected}
                        onChange={setDpsSelected}
                        labelledBy="dsdatphong"
                        overrideStrings={{
                          allItemsAreSelected: "Tất cả phòng đã được chọn.",
                          clearSearch: "Xóa tìm kiếm",
                          noOptions: "Không lựa chọn",
                          search: "Tìm kiếm ...",
                          selectAll: "Chọn tất cả",
                          selectSomeItems: "Chọn...",
                        }}
                      />
                    </div>

                    <p className="text-danger my-2">{msgError}</p>
                    <p className="text-success my-2">{msgSuccess}</p>
                    <button
                      type="button"
                      className="btn btn-primary py-2 px-4 "
                      onClick={handleSubmit}
                    >
                      Lập hóa đơn
                    </button>
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

export default LapHoaDon;
