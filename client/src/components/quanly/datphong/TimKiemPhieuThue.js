import React, { useContext, useState } from "react";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const TimKiemPhieuThue = () => {
  const { setDsDatPhong } = useContext(AccountContext);

  const [ten, setTen] = useState("");
  const [tt, setTt] = useState("");
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

                const res = await DatPhongFinder.get(
                  `/tim-kiem-pt/%25${e.target.value}%25/%25${tt}%25`
                );
                console.log(res);
                setDsDatPhong(res.data.data.datphong);
              }}
              placeholder="Tìm kiếm theo tên khách hàng ..."
            />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <select
              className="form-control"
              value={tt}
              onChange={async (e) => {
                setTt(e.target.value);
                const res = await DatPhongFinder.get(
                  `/tim-kiem-pt/%25${ten}%25/%25${e.target.value}%25`
                );
                console.log(res);
                setDsDatPhong(res.data.data.datphong);
              }}
            >
              <option value="" disabled>
                Chọn ...
              </option>
              <option value="">--Tất cả--</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Đã thanh toán</option>
              <option value="2">Đã bị hủy</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimKiemPhieuThue;
