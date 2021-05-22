import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import DoiHuyFinder from "../../../apis/DoiHuyFinder";
import {
  NormalizeDate,
  convertTime,
  NumberFormat,
} from "../../../utils/DataHandler";
import SuaPhieuXacNhan from "./SuaPhieuXacNhan";
import XoaPhieuXacNhan from "./XoaPhieuXacNhan";

const PhieuHuyPhong = () => {
  const { controllerPhieuXacNhan } = useContext(AccountContext);
  const userrole = window.localStorage.getItem("user_role");

  const [dsHuyPhong, setDsHuyPhong] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await DoiHuyFinder.get("/danh-sach-huy");
        setDsHuyPhong(res.data.data.huyphong);
      } catch (er) {
        console.log(er.message);
      }
    };
    fetchData();
  }, []);
  return (
    <div className={controllerPhieuXacNhan === "hp" ? "row" : "row d-none"}>
      {dsHuyPhong.map((hp) => {
        return (
          <div className="col-4" key={hp.id}>
            <div className="card mb-4">
              <div className="card-header">
                <h5 className="text-center">
                  {hp.kh_name} - {hp.kh_sdt}
                </h5>
              </div>
              <div className="card-body ">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    Phòng hủy : <strong>{hp.phonghuy}</strong>
                  </li>
                  <li className="list-group-item">Lý do : {hp.lydohuy}</li>
                  <li className="list-group-item">
                    Ngày hủy: {NormalizeDate(hp.ngayhuy)}, lúc{" "}
                    {convertTime(hp.ngayhuy)}
                  </li>
                  <li className="list-group-item">Người hủy : {hp.nguoihuy}</li>
                  <li className="list-group-item">
                    Tiền cọc KH : <strong>{NumberFormat(hp.tiencoc)}</strong>
                    &nbsp;VND
                  </li>
                </ul>
              </div>
              <div className="card-footer d-flex flex-row justify-content-center">
                <SuaPhieuXacNhan type="hp" id={hp.id} />
                {userrole === "QL" || userrole === "Admin" ? (
                  <XoaPhieuXacNhan type="hp" dp={hp} />
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

export default PhieuHuyPhong;
