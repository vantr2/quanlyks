import React, { useContext, useState } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const TimKiemNguoiDung = () => {
  const { setNguoiDungList } = useContext(AccountContext);
  const [kitu, setKitu] = useState("");
  return (
    <div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={kitu}
          onChange={async (e) => {
            setKitu(e.target.value);

            const res = await TaiKhoanFinder.get(
              `/tim-kiem-nguoi-dung/%25${e.target.value}%25`
            );
            setNguoiDungList(res.data.data.nguoidung);
          }}
          placeholder="Tìm kiếm theo tên tài khoản và tên hiển thị ..."
        />
      </div>
    </div>
  );
};

export default TimKiemNguoiDung;
