import React, { useContext, useEffect } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import PhieuMuaFinder from "../../../apis/PhieuMuaFinder";
import { NumberFormat } from "../../../utils/DataHandler";
import { useParams } from "react-router";
import XoaPhieuMuaChiTiet from "./XoaPhieuMuaChiTiet";
import SuaPhieuMuaChiTiet from "./SuaPhieuMuaChiTiet";

const DanhSachPhieuMuaChiTiet = () => {
  const { dsPhieuMuaChiTiet, setDsPhieuMuaChiTiet } =
    useContext(AccountContext);
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhieuMuaFinder.get(`/danh-sach-chi-tiet/${id}`);
        if (res.data.status === "ok") {
          setDsPhieuMuaChiTiet(res.data.data.phieumua_chitiet);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsPhieuMuaChiTiet, id]);
  return (
    <div className="row mt-5 ">
      {dsPhieuMuaChiTiet.map((pmchitiet) => {
        return (
          <div className="col-sm-6 mb-4" key={pmchitiet.id}>
            <div className="card border border-dark">
              <div className="card-header d-flex justify-content-between ">
                <h5>{pmchitiet.ten}</h5>
                <span className="d-flex">
                  <SuaPhieuMuaChiTiet
                    id={pmchitiet.id}
                    pmid={pmchitiet.phieumua_id}
                  />
                  <XoaPhieuMuaChiTiet
                    id={pmchitiet.id}
                    pmid={pmchitiet.phieumua_id}
                    pmct={pmchitiet}
                  />

                  {/* <i className="fas fa-pencil-alt p-1 text-primary"></i>
                  <i className="fas fa-trash p-1 text-danger"></i> */}
                </span>
              </div>
              <div className="card-body">
                <p className="card-text">
                  <strong>Ghi chú: </strong> {pmchitiet.ghichu}
                </p>
              </div>
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Đơn giá: </strong>
                  <u>{NumberFormat(pmchitiet.dongia)}</u> <strong>VND</strong> /
                  1 <em>{pmchitiet.donvitinh_name}</em>
                </li>
                <li className="list-group-item">
                  <strong>Số lượng: </strong> {pmchitiet.soluong}
                  <em> {pmchitiet.donvitinh_name}</em>
                </li>

                <li className="list-group-item">
                  <strong>Thành tiền: </strong>
                  <u>{NumberFormat(pmchitiet.thanhtien)}</u>{" "}
                  <strong>VND</strong>
                </li>

                <li className="list-group-item">
                  <strong>Loại hàng: </strong>
                  {pmchitiet.loaihang_name}
                </li>
                <li className="list-group-item">
                  <strong>Nhà cung cấp: </strong> {pmchitiet.nhacc_name}
                </li>
                <li className="list-group-item">
                  <strong>SDT: </strong> {pmchitiet.nhacc_sdt}
                </li>
                <li className="list-group-item">
                  <strong>Địa chỉ: </strong> {pmchitiet.nhacc_diachi}
                </li>
              </ul>
            </div>
          </div>
        );
      })}

      {/* <div className="col-sm-6 mb-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between ">
            <h5>Dday la tenhang hoa</h5>
            <span>
              <i className="fas fa-pencil-alt p-1 text-primary"></i>
              <i className="fas fa-trash p-1 text-danger"></i>
            </span>
          </div>
          <div className="card-body">
            <p className="card-text">
              <strong>Ghi chú: </strong> Some quick example text to build on the
              card title and make up the bulk of the card's content.
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Đơn giá: </strong>
              <u>190000</u> VND / 1 chiếc
            </li>
            <li className="list-group-item">
              <strong>Số lượng: </strong>12
            </li>

            <li className="list-group-item">
              <strong>Thành tiền: </strong>12
            </li>

            <li className="list-group-item">
              <strong>Loại hàng: </strong>12
            </li>
            <li className="list-group-item">
              <strong>Nhà cung cấp: </strong> sjfsdkfs kfjaskldja dfdsj dsfjsdk
              skdj fklsd s sdlk
            </li>
            <li className="list-group-item">
              <strong>SDT: </strong> 0123131312312
            </li>
            <li className="list-group-item">
              <strong>Địa chỉ: </strong> THủy nguyên hải phòng
            </li>
          </ul>
        </div>
      </div> */}
    </div>
  );
};

export default DanhSachPhieuMuaChiTiet;
