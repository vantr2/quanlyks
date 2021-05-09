import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import { NumberFormat } from "../../../utils/DataHandler";
import { useParams } from "react-router";
import XoaTaiSanBaoDuong from "./XoaTaiSanBaoDuong";
import SuaTaiSanBaoDuong from "./SuaTaiSanBaoDuong";
const DanhSachTaiSanBaoDuong = () => {
  const { dsBaoDuongChiTiet, setDsBaoDuongChiTiet } = useContext(
    AccountContext
  );

  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await BaoDuongFinder.get(`/danh-sach-chi-tiet/${id}`);
        if (res.data.status === "ok") {
          setDsBaoDuongChiTiet(res.data.data.baoduong_chitiet);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsBaoDuongChiTiet, id]);

  return (
    <div className="d-flex flex-wrap ">
      {dsBaoDuongChiTiet.map((bdchitiet) => {
        return (
          <div
            key={bdchitiet.id}
            className="card mb-3 mt-5 mx-3"
            style={{ width: "30%" }}
          >
            <div className="card-header d-flex justify-content-between ">
              <h6>{bdchitiet.ten}</h6>
              <span className="d-flex">
                <SuaTaiSanBaoDuong id={bdchitiet.id} bdId={id} />
                <XoaTaiSanBaoDuong
                  id={bdchitiet.id}
                  tsId={bdchitiet.taisanbd}
                  bdId={id}
                />
              </span>
            </div>
            <div className="card-body">
              <p>
                Chi phí: <u>{NumberFormat(bdchitiet.phibd)}</u> VND
              </p>
              <p>Ghi chú: {bdchitiet.ghichu}</p>
            </div>
          </div>
        );
      })}
      {/* <div className="card mb-3 mt-5 mx-3" style={{ maxWidth: "30%" }}>
        <div className="card-header d-flex justify-content-between ">
          <h5>Dday la ten tai san</h5>
          <span>
            <i className="fas fa-pencil-alt p-1 text-primary"></i>
            <i className="fas fa-trash p-1 text-danger"></i>
          </span>
        </div>
        <div className="card-body">
          <p className="card-text">
            asdjaskjdahsjkdahsjdj skdandsk kja bdk jad akjd akjd
          </p>
        </div>
      </div> */}
    </div>
  );
};

export default DanhSachTaiSanBaoDuong;
