import React, { useContext, useEffect, useState } from "react";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const TimKiemNhanVien = () => {
  const [tenNV, setTenNV] = useState("");
  const [acc, setAcc] = useState("--Chọn người dùng--");
  const [accFiltered, setAccFiletered] = useState([]);
  const { setDsNhanVien } = useContext(AccountContext);
  const handleChangeName = async (e) => {
    setAcc("--Chọn người dùng--");
    setTenNV(e.target.value);
    console.log(e.target.value);
    if (e.target.value === "") {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien");
        setDsNhanVien(res.data.data.nhanvien);
      } catch (err) {
        console.log("Tim kiem nhan vien: " + err.mesage);
      }
    } else {
      try {
        const res = await NhanVienFinder.get(
          `/tim-kiem-nhan-vien-theo-ten/${e.target.value}`
        );
        // console.log(res);
        setDsNhanVien(res.data.data.nhanvien);
      } catch (err) {
        console.log("Tim kiem nhan vien: " + err.mesage);
      }
    }
  };

  const handleChangeAcc = async (e) => {
    setTenNV("");
    setAcc(e.target.value);
    if (e.target.value === "") {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien");
        setDsNhanVien(res.data.data.nhanvien);
      } catch (err) {
        console.log("Tim kiem nhan vien: " + err.mesage);
      }
    } else {
      try {
        const res = await NhanVienFinder.get(
          `/tim-kiem-nhan-vien-theo-acc/${e.target.value}`
        );
        setDsNhanVien(res.data.data.nhanvien);
      } catch (err) {
        console.log("Tim kiem nhan vien: " + err.mesage);
      }
    }
  };

  useEffect(() => {
    const filterData = async () => {
      try {
        const res = await TaiKhoanFinder.get("/loc-nguoi-dung-duoc-cap-quyen");
        setAccFiletered(res.data.data.nguoidung);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterData();
  }, [setAccFiletered]);

  return (
    <div>
      <div id="timkiemnhanvien">
        <div className="card">
          <div className="card-header" id="timkiemnhanviencard">
            <h5 className="mb-0">
              <div
                className="text-dark collapsed"
                data-toggle="collapse"
                data-target="#formtimkiemnhanvien"
                aria-expanded="false"
                aria-controls="formtimkiemnhanvien"
                style={{ cursor: "pointer" }}
              >
                Lọc nhân viên
              </div>
            </h5>
          </div>
          <div
            id="formtimkiemnhanvien"
            className="collapse"
            aria-labelledby="timkiemnhanviencard"
            data-parent="#timkiemnhanvien"
          >
            <div className="card-body px-5">
              <form action="" className="mx-5">
                <div className="form-group">
                  <div className="form-row">
                    <div className="col">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control border-right-0"
                          placeholder="Tên nhân viên"
                          value={tenNV}
                          // onChange={(e) => {
                          //   handleChangeName(e);
                          // }}
                          onChange={(e) => {
                            handleChangeName(e);
                          }}
                        />
                        <div className="input-group-prepend ">
                          <span className="input-group-text  border-left-0">
                            <i className="fas fa-filter"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="input-group">
                        <select
                          value={acc}
                          className="form-control border-right-0"
                          onChange={(e) => {
                            handleChangeAcc(e);
                          }}
                        >
                          <option value="--Chọn người dùng--">
                            --Chọn tài khoản--
                          </option>
                          {accFiltered.map((nguoidung) => {
                            return (
                              <option key={nguoidung.ten} value={nguoidung.ten}>
                                {nguoidung.ten}
                              </option>
                            );
                          })}
                        </select>
                        <div className="input-group-prepend">
                          <span className="input-group-text  border-left-0">
                            <i className="fas fa-filter"></i>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimKiemNhanVien;
