import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DoiHuyFinder from "../../../apis/DoiHuyFinder";
import { NormalizeDate, convertTime } from "../../../utils/DataHandler";
import SuaPhieuXacNhan from "./SuaPhieuXacNhan";
import XoaPhieuXacNhan from "./XoaPhieuXacNhan";
const PhieuDoiPhong = () => {
  const { controllerPhieuXacNhan } = useContext(AccountContext);
  const userrole = window.localStorage.getItem("user_role");
  const [dsDoiPhong, setDsDoiPhong] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DoiHuyFinder.get("/danh-sach-doi");
        setDsDoiPhong(res.data.data.doiphong);
      } catch (er) {
        console.log(er.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div className={controllerPhieuXacNhan === "dp" ? "row" : "row d-none"}>
      {dsDoiPhong.map((dp) => {
        return (
          <div className="col-4" key={dp.id}>
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="text-center">
                  {dp.kh_name} - {dp.kh_sdt}
                </h5>
              </div>
              <div className="card-body ">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Đổi từ : <strong>{dp.tuphong}</strong> sang{" "}
                    <strong>{dp.denphong}</strong>
                  </li>
                  <li className="list-group-item">Lý do : {dp.lydodoi}</li>
                  <li className="list-group-item">
                    Ngày đổi: {NormalizeDate(dp.ngaydoi)}, lúc{" "}
                    {convertTime(dp.ngaydoi)}
                  </li>
                  <li className="list-group-item">Người đổi : {dp.nguoidoi}</li>
                </ul>
              </div>
              <div className="card-footer d-flex flex-row justify-content-center">
                <SuaPhieuXacNhan type="dp" id={dp.id} />
                {userrole === "QL" || userrole === "Admin" ? (
                  <XoaPhieuXacNhan type="dp" dp={dp} />
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PhieuDoiPhong;
