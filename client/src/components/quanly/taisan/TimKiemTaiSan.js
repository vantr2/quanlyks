import React, { useContext, useEffect, useState } from "react";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import PhongFinder from "../../../apis/PhongFinder";

const TimKiemTaiSan = () => {
  const { setDsTaiSan, vitritk, setViTriTk } = useContext(AccountContext);

  const [ten, setTen] = useState("");
  const [dsPhong, setDsPhong] = useState([]);
  useEffect(() => {
    const fetchDataPhong = async () => {
      try {
        const res = await PhongFinder.get("/danh-sach-phong");
        setDsPhong(res.data.data.phong);

        const res_tk = await TaiSanFinder.get(
          `/tim-kiem-tai-san/%25${ten}%25/%25${vitritk}%25`
        );
        // console.log(res);
        setDsTaiSan(res_tk.data.data.taisan);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchDataPhong();
  }, [setDsTaiSan, ten, vitritk]);
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

                const res = await TaiSanFinder.get(
                  `/tim-kiem-tai-san/%25${e.target.value}%25/%25${vitritk}%25`
                );
                console.log(res);
                setDsTaiSan(res.data.data.taisan);
              }}
              placeholder="Tìm kiếm theo tên tài sản ..."
            />
          </div>
        </div>
        <div className="col">
          <div className="form-group">
            <select
              className="form-control"
              value={vitritk}
              onChange={async (e) => {
                setViTriTk(e.target.value);
                const res = await TaiSanFinder.get(
                  `/tim-kiem-tai-san/%25${ten}%25/%25${e.target.value}%25`
                );
                // console.log(res);
                setDsTaiSan(res.data.data.taisan);
              }}
            >
              <option value="" disabled>
                Chọn một phòng để lọc ...
              </option>
              <option value="">--Tất cả--</option>
              {dsPhong.map((phong) => {
                return (
                  <option value={phong.ten} key={phong.ten}>
                    {phong.ten}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimKiemTaiSan;
