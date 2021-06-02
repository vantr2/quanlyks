	import React, { useContext, useEffect, useState } from "react";
import KhachHangFinder from "../../../apis/KhachHangFinder";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import Select from "react-select";
import {
  convertDate,
  convertDataTocreatableSelect,
} from "../../../utils/DataHandler";
import CreatableSelect from "react-select/creatable";
import NormalizeString from "../../../utils/NormalizeString";
import ThemLichSu from "../../../utils/ThemLichSu";

const ThongTinKhachHang = () => {
  //   const [dsKhachHang, setDsKhachHang] = useState([]);
  const [khID, setKhId] = useState("");

  const [tenKH, setTenKH] = useState("");
  const [gioitinh, setGioiTinh] = useState("");
  const [ngaysinh, setNgaySinh] = useState("");
  const [diachi, setDiaChi] = useState("");
  const [cmnd, setCMND] = useState("");
  const [sdt, setSdt] = useState("");
  const [acc, setAcc] = useState("");
  const [stk, setStk] = useState("");

  const [msg, setMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [buttonThem, setButtonThem] = useState("");
  const [buttonSua, setButtonSua] = useState("d-none");
  const [disableAccount, setDisableAccount] = useState(false);

  const [kieukhID, setKieuKhID] = useState("");
  const [kieuKH, setKieuKH] = useState([]);
  const [kieuKHSelected, setKieuKHSelected] = useState([]);

  const { setKHID } = useContext(AccountContext);

  const [optionsKH, setOptionsKH] = useState([]);
  const [valueKh, setValueKh] = useState({
    label: "-- Chưa có --",
    value: "",
  });

  const [old, setOld] = useState({});
  //   const validateData = async (data, type) => {
  //     if (type === "SDT") {
  //       const res = await KhachHangFinder.get(`/kiem-tra-sdt/${data}`);
  //       if (res.data.data.khachhang.count === 0) return true;
  //     } else if (type === "CMND") {
  //       const res = await KhachHangFinder.get(`/kiem-tra-cmnd/${data}`);
  //       console.log(res.data.data.khachhang);
  //       if (res.data.data.khachhang.count === 0) return true;
  //     } else if (type === "STK") {
  //       const res = await KhachHangFinder.get(`/kiem-tra-stk/${data}`);
  //       if (res.data.data.khachhang.count === 0) return true;
  //     }
  //     return false;
  //   };

  const getKieuKhachHang = async () => {
    try {
      const res = await KhachHangFinder.get("/danh-sach-kieu");
      setKieuKH(convertDataTocreatableSelect(res.data.data.kieukh));
    } catch (err) {
      console.log(err.message);
    }
  };

  const getListKh = async () => {
    try {
      const res = await KhachHangFinder.get("/danh-sach");
      //   setDsKhachHang(res.data.data.khachhang);
      const options = [
        {
          label: "-- Chưa có --",
          value: "",
        },
      ];
      res.data.data.khachhang.forEach((item) => {
        const option = {
          label: item.sdt + " - " + item.ten,
          value: item.id,
        };
        options.push(option);
      });
      setOptionsKH(options);
      //   setKHID("");
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    getListKh();
    getKieuKhachHang();
  }, []);

  const getMotKH = async (id) => {
    try {
      const res = await KhachHangFinder.get(`/danh-sach/${id}`);
      //   console.log(res.data.data.khachhang);
      const khachhangSelected = res.data.data.khachhang;
      setTenKH(khachhangSelected.ten);
      setGioiTinh(khachhangSelected.gioitinh);
      setNgaySinh(convertDate(khachhangSelected.ngaysinh));
      setDiaChi(khachhangSelected.diachi);
      setCMND(khachhangSelected.cmnd);
      setSdt(khachhangSelected.sdt);
      setAcc(khachhangSelected.account);
      setKieuKhID(khachhangSelected.kieukhachhang_id);
      setStk(khachhangSelected.stk);
      setKieuKHSelected({
        value: khachhangSelected.kieukhachhang_id,
        label: khachhangSelected.kieukhachhang_name,
      });

      //Lich su hoat dong
      setOld({
        id: khachhangSelected.id + "",
        ten: khachhangSelected.ten,
        cmnd: khachhangSelected.cmnd,
        gioitinh: khachhangSelected.gioitinh,
        ngaysinh: convertDate(khachhangSelected.ngaysinh),
        diachi: khachhangSelected.diachi,
        sdt: khachhangSelected.sdt,
        kieukhachhang_id: khachhangSelected.kieukhachhang_id,
        stk: khachhangSelected.stk,
      });
    } catch (err) {
      console.log(err.message);
    }
  };

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "black" : "#51515",
      padding: 5,
    }),
  };

  const handleChangeKieuKhachHang = (dataSelected, actionMeta) => {
    if (actionMeta.action === "select-option") {
      setKieuKhID(dataSelected.value);
      setKieuKHSelected(dataSelected);
    } else if (actionMeta.action === "create-option") {
      handleAddKieuKhachHang(dataSelected.value);
    } else if (actionMeta.action === "clear") {
      setKieuKhID("");
      setKieuKHSelected({});
    }
  };

  const handleAddKieuKhachHang = async (name) => {
    try {
      const res = await KhachHangFinder.post("/them-kieu", {
        name: name,
      });
      ThemLichSu({
        doing: "Thêm",
        olddata: {},
        newdata: { new: res.data.data.kieukh },
        tbl: "Kiểu khách hàng",
      });
      setKieuKhID(res.data.data.kieukh.id);
      setKieuKHSelected({
        value: res.data.data.kieukh.id,
        label: res.data.data.kieukh.name,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleChangeSelectKh = (value, action) => {
    setValueKh(value);
    setKhId(value.value);
    setKHID(value.value);
    if (action.action === "select-option") {
      if (value.value !== "") {
        getMotKH(value.value);
        setButtonThem("d-none");
        setButtonSua("");
        setDisableAccount(true);
      } else {
        setTenKH("");
        setGioiTinh("");
        setNgaySinh("");
        setDiaChi("");
        setCMND("");
        setSdt("");
        setAcc("");
        setStk("");
        setButtonSua("d-none");
        setButtonThem("");
        setDisableAccount(false);
        setKieuKhID("");
        setKieuKHSelected([]);
      }
    }
    console.log(value, action);
  };
  //   const handleChangeDsKH = (e) => {
  //     setKhId(e.target.value);
  //     setKHID(e.target.value);
  //     if (e.target.value !== "0") {
  //       getMotKH(e.target.value);
  //       setButtonThem("d-none");
  //       setButtonSua("");
  //       setDisableAccount(true);
  //     } else {
  //       setTenKH("");
  //       setGioiTinh("");
  //       setNgaySinh("");
  //       setDiaChi("");
  //       setCMND("");
  //       setSdt("");
  //       setAcc("");
  //       setButtonSua("d-none");
  //       setButtonThem("");
  //       setDisableAccount(false);
  //       setKieuKhID("");
  //       setKieuKHSelected([]);
  //     }
  //   };

  const handleInsertKh = async () => {
    if (!tenKH) {
      setMsg("Tên khách hàng không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (gioitinh === "") {
      setMsg("Giới tính không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (!ngaysinh) {
      setMsg("Ngày sinh không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (!cmnd) {
      setMsg("Chứng minh nhân dân không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (cmnd.length !== 12) {
      setMsg("Chứng minh nhân dân không hợp lệ. (gồm 12 số). ");
      setTimeout(() => {
        setMsg("");
      }, 3500);
    } else if (!sdt) {
      setMsg("Số điện thoại không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (sdt.length < 10 || sdt.length > 11) {
      setMsg(
        "Số điện thoại không hợp lệ. (gồm 10 số với di động, 11 số với máy bàn)."
      );
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } else if (!diachi) {
      setMsg("Địa chỉ không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (stk.length < 9 || stk.length > 15) {
      setMsg("Số tài khoản không hợp lệ.");
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } else if (!kieukhID) {
      setMsg("Kiểu khách hàng không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (!acc) {
      setMsg("Tên tài khoản không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else {
      try {
        const res_check_cmnd = await KhachHangFinder.get(
          `/kiem-tra-cmnd/${cmnd}`
        );
        const res_check_sdt = await KhachHangFinder.get(`/kiem-tra-sdt/${sdt}`);
        const res_check_stk = await KhachHangFinder.get(`/kiem-tra-stk/${stk}`);
        console.log(res_check_stk.data.data.khachhang.count);
        if (res_check_cmnd.data.data.khachhang.count === "1") {
          setMsg("Chứng minh nhân dân đã tồn tại.  ");
          setTimeout(() => {
            setMsg("");
          }, 3500);
        } else if (res_check_sdt.data.data.khachhang.count === "1") {
          setMsg("Số điện thoại đã tồn tại.  ");
          setTimeout(() => {
            setMsg("");
          }, 3500);
        } else if (res_check_stk.data.data.khachhang.count === "1") {
          setMsg("Số tài khoản đã tồn tại.  ");
          setTimeout(() => {
            setMsg("");
          }, 3500);
        } else {
          const res = await TaiKhoanFinder.post("/them-tai-khoan-khach-hang", {
            ten: acc,
            mk: "12345678",
            ten_hienthi: NormalizeString(tenKH),
          });
          if (res.data.status === "ok") {
            ThemLichSu({
              doing: "Thêm",
              olddata: {},
              newdata: {
                new: {
                  ten: res.data.data.acc.ten,
                  ten_hienthi: res.data.data.acc.ten_hienthi,
                  vaitro: res.data.data.acc.vaitro,
                },
              },
              tbl: "Người dùng",
            });
            const r = await KhachHangFinder.post("/them", {
              ten: NormalizeString(tenKH),
              cmnd: cmnd,
              gioitinh: gioitinh,
              ngaysinh: ngaysinh,
              diachi: NormalizeString(diachi),
              sdt: sdt,
              kieukhachhang_id: kieukhID,
              account: res.data.data.acc.ten,
              stk: stk,
            });
            console.log(r);
            if (r.data.status === "ok") {
              ThemLichSu({
                doing: "Thêm",
                olddata: {},
                newdata: {
                  new: r.data.data.khachhang,
                },
                tbl: "Khách hàng",
              });
              getListKh();
              setKHID(r.data.data.khachhang.id);
              setKhId(r.data.data.khachhang.id);
              setValueKh({
                label:
                  r.data.data.khachhang.sdt + " - " + r.data.data.khachhang.ten,
                value: r.data.data.khachhang.id,
              });
              getMotKH(r.data.data.khachhang.id);
              setButtonThem("d-none");
              setButtonSua("");
              setDisableAccount(true);
              setSuccessMsg("Thêm thành công");
              setTimeout(() => {
                setSuccessMsg("");
              }, 3000);
            } else {
              setMsg(r.data.status);
              setTimeout(() => {
                setMsg("");
              }, 3000);
            }
          }
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  const handleUpdateKh = async () => {
    if (!tenKH) {
      setMsg("Tên khách hàng không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (gioitinh === "") {
      setMsg("Giới tính không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (!ngaysinh) {
      setMsg("Ngày sinh không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (!cmnd) {
      setMsg("Chứng minh nhân dân không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (cmnd.length !== 12) {
      setMsg("Chứng minh nhân dân không hợp lệ. (gồm 12 số). ");
      setTimeout(() => {
        setMsg("");
      }, 3500);
    } else if (!sdt) {
      setMsg("Số điện thoại không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (sdt.length < 10 || sdt.length > 11) {
      setMsg(
        "Số điện thoại không hợp lệ. (gồm 10 số với di động, 11 số với máy bàn)."
      );
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } else if (!diachi) {
      setMsg("Địa chỉ không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else if (stk.length < 9 || sdt.length > 15) {
      setMsg("Số tài khoản không hợp lệ.");
      setTimeout(() => {
        setMsg("");
      }, 5000);
    } else if (!kieukhID) {
      setMsg("Kiểu khách hàng không được để trống");
      setTimeout(() => {
        setMsg("");
      }, 3000);
      //
    } else {
      try {
        const res = await KhachHangFinder.put("/sua", {
          id: khID,
          ten: NormalizeString(tenKH),
          cmnd: cmnd,
          gioitinh: gioitinh,
          ngaysinh: ngaysinh,
          diachi: NormalizeString(diachi),
          sdt: sdt,
          kieukhachhang_id: kieukhID,
          stk: stk,
        });
        console.log(res);
        if (res.data.status === "ok") {
          const newd = {
            id: khID,
            ten: NormalizeString(tenKH),
            cmnd: cmnd,
            gioitinh: gioitinh,
            ngaysinh: ngaysinh,
            diachi: NormalizeString(diachi),
            sdt: sdt,
            kieukhachhang_id: kieukhID,
            stk: stk,
          };
          if (JSON.stringify(old) !== JSON.stringify(newd)) {
            ThemLichSu({
              doing: "Sửa",
              olddata: { old },
              newdata: {
                new: newd,
              },
              tbl: "Khách hàng",
            });
          }

          getListKh();
          setSuccessMsg("Sửa thành công");
          setTimeout(() => {
            setSuccessMsg("");
          }, 3000);
        } else {
          setMsg(res.data.status);
          setTimeout(() => {
            setMsg("");
          }, 3000);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div>
      <h3 className="text-center">Thông tin khách hàng</h3>

      <form action="" className="mt-5">
        <Select
          className="form-group"
          options={optionsKH}
          value={valueKh}
          onChange={handleChangeSelectKh}
        />
        {/* <div className="input-group-prepend form-group">
          <label className="input-group-text" htmlFor="dskhachhang">
            Khách hàng
          </label>
          <select
            id="dskhachhang"
            value={khID}
            className="custom-select"
            onChange={(e) => handleChangeDsKH(e)}
          >
            <option value="0">-- Chưa có --</option>
            {dsKhachHang.map((kh) => {
              return (
                <option value={kh.id} key={kh.id}>
                  {kh.ten} - {kh.cmnd} - {kh.account}
                </option>
              );
            })}
          </select>
        </div> */}

        <div className="form-group">
          <label htmlFor="tenkh">Tên khách hàng</label>
          <input
            type="text"
            id="tenkh"
            className="form-control"
            value={tenKH}
            onChange={(e) => setTenKH(e.target.value)}
          />
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="gioitinh">Giới tính</label>
              <select
                id="giotinh"
                value={gioitinh}
                className="form-control"
                onChange={(e) => setGioiTinh(e.target.value)}
              >
                <option value="">-- Chọn --</option>
                <option value="0">Nam</option>
                <option value="1">Nữ</option>
                <option value="2">KXD</option>
              </select>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="ngaysinh">Ngày sinh</label>
              <input
                type="date"
                id="ngaysinh"
                className="form-control"
                value={ngaysinh}
                onChange={(e) => setNgaySinh(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="cmnd">Chứng minh nhân dân</label>
              <input
                type="text"
                className="form-control"
                id="cmnd"
                onChange={(e) => setCMND(e.target.value)}
                value={cmnd}
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
            onChange={(e) => setDiaChi(e.target.value)}
            value={diachi}
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="stk">Số tài khoản</label>
          <input
            type=""
            className="form-control"
            id="stk"
            onChange={(e) => setStk(e.target.value)}
            value={stk}
          />
        </div>
        <div className="form-row">
          <div className="col">
            <div className="form-group ">
              <label htmlFor="kieukh">Kiểu khách hàng</label>
              <CreatableSelect
                id="kieukh"
                isClearable
                onChange={handleChangeKieuKhachHang}
                options={kieuKH}
                styles={customStyles}
                value={kieuKHSelected}
              />
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label htmlFor="taikhoan">Tài khoản sử dụng</label>
              <input
                type="text"
                className="form-control"
                id="taikhoan"
                onChange={(e) => setAcc(e.target.value)}
                value={acc}
                disabled={disableAccount}
              />
            </div>
          </div>
        </div>

        <p className="text-danger">{msg}</p>
        <p className="text-success">{successMsg}</p>
        <div className="d-flex flex-row mb-5">
          <button
            type="button"
            onClick={handleInsertKh}
            className={`btn btn-primary ${buttonThem}`}
          >
            Thêm
          </button>
          <button
            type="button"
            onClick={handleUpdateKh}
            className={`btn btn-warning px-4 ${buttonSua}`}
          >
            Sửa
          </button>
        </div>
      </form>
    </div>
  );
};

export default ThongTinKhachHang;
