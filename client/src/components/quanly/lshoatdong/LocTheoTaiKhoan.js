import React, { useContext, useEffect, useState } from "react";
import LichSuFinder from "../../../apis/LichSuFinder";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { AccountContext } from "../../../contexts/AccountContext";
const LocTheoTaiKhoan = () => {
  const [taikhoan, setTaiKhoan] = useState("");
  const [dsTk, setDsTk] = useState([]);

  const userrole = window.localStorage.getItem("user_role");
  const { setDsLichSu } = useContext(AccountContext);
  const username = window.localStorage.getItem("user_name");

  useEffect(() => {
    const filterTK = async () => {
      try {
        const res = await NhanVienFinder.get("/danh-sach-nhan-vien");
        setDsTk(res.data.data.nhanvien);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterTK();
  }, []);
  return (
    <div className="mt-5">
      <select
        value={taikhoan}
        onChange={async (e) => {
          setTaiKhoan(e.target.value);
          if (e.target.value) {
            try {
              const res = await LichSuFinder.get(
                `/danh-sach-theo-nv/${e.target.value}`
              );
              setDsLichSu(res.data.data.lichsu);
            } catch (err) {
              console.log(err.message);
            }
          } else {
            try {
              let res;
              if (userrole === "QL") {
                res = await LichSuFinder.get("/danh-sach-cap-quan-ly");
              } else {
                res = await LichSuFinder.get("/danh-sach");
              }

              setDsLichSu(res.data.data.lichsu);
            } catch (err) {
              console.log(err.message);
            }
          }
        }}
        className="form-control"
      >
        <option value="">-- Tất cả --</option>
        {userrole === "Admin" ? <option value={username}>Admin</option> : ""}
        {dsTk.map((tk) => {
          return (
            <option key={tk.id} value={tk.account}>
              {tk.account} - {tk.name} - {tk.vaitro}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LocTheoTaiKhoan;
