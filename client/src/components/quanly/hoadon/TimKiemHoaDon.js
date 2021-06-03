import React, { useContext, useState } from "react";
import HoaDonFinder from "../../../apis/HoaDonFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const TimKiemHoaDon = () => {
  const { setDsHoaDon } = useContext(AccountContext);
  const [ten, setTen] = useState("");
  const [nv, setNv] = useState("");
  return (
    <div>
      <div className="form-row">
        <div className="col">
          {" "}
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={ten}
              onChange={async (e) => {
                setTen(e.target.value);

                const res = await HoaDonFinder.get(
                  `/tim-kiem-hoa-don/%25${e.target.value}%25/%25${nv}%25`
                );
                // console.log(res);
                setDsHoaDon(res.data.data.hoadon);
              }}
              placeholder="Tìm kiếm theo tên khách hàng ..."
            />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={nv}
              onChange={async (e) => {
                setNv(e.target.value);

                const res = await HoaDonFinder.get(
                  `/tim-kiem-hoa-don/%25${ten}%25/%25${e.target.value}%25`
                );
                // console.log(res);
                setDsHoaDon(res.data.data.hoadon);
              }}
              placeholder="Tìm kiếm theo tên nhân viên ..."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimKiemHoaDon;
