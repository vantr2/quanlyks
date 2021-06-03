import React, { useContext, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DatPhongOnlineFinder from "../../../apis/DatPhongOnlineFinder";

const TimKiemDPOl = () => {
  const { setDsDpOnline } = useContext(AccountContext);
  const [ten, setTen] = useState("");
  return (
    <div>
      <div className="form-group">
        <input
          type="text"
          className="form-control"
          value={ten}
          onChange={async (e) => {
            setTen(e.target.value);

            const res = await DatPhongOnlineFinder.get(
              `/tim-kiem/%25${e.target.value}%25/`
            );
            // console.log(res);
            setDsDpOnline(res.data.data.dponline);
          }}
          placeholder="Tìm kiếm theo tên khách hàng ..."
        />
      </div>
    </div>
  );
};

export default TimKiemDPOl;
