import XinNghiFinder from "../../../apis/XinNghiFinder";
import React, { useEffect, useState } from "react";
import { NormalizeDate } from "../../../utils/DataHandler";
import HanhDongDuyet from "./HanhDongDuyet";

const DanhSachCho = () => {
  const [dsDonCho, setDsDonCho] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await XinNghiFinder.get("/danh-sach-cho");
        // console.log(res);
        setDsDonCho(res.data.data.xinnghi);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);
  const renderThoiGianNghi = (tg) => {
    let result;
    switch (tg + "") {
      case "0":
        result = "Nửa ngày";
        break;
      case "1":
        result = "Một ngày";
        break;
      case "2":
        result = "Một ngày rưỡi";
        break;
      case "3":
        result = "Hai ngày";
        break;
      default:
        break;
    }
    return result;
  };
  return (
    <div className="row mt-5">
      {dsDonCho.length !== 0 ? (
        dsDonCho.map((doncho) => {
          return (
            <div className="col-sm-6 mb-4" key={doncho.id}>
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-center mb-4">
                    <img
                      className="border border-mute rounded-circle"
                      src={
                        doncho.avt !== "images/no-user.jpg"
                          ? doncho.avt
                          : "http://localhost:3000/images/no-user.jpg"
                      }
                      alt="Ảnh nhân viên"
                      width="20%"
                    />
                    <div className="d-lex ml-3 align-items-center">
                      <h5 className="card-title mb-1">{doncho.tennv}</h5>
                      <p className="card-text">{doncho.sdt}</p>
                    </div>
                  </div>
                  <p className="card-text">
                    <strong>Lý do nghỉ: </strong> {doncho.lydo}
                  </p>
                </div>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <strong>Ngày nghỉ: </strong>
                    {NormalizeDate(doncho.khinao)}
                  </li>
                  <li className="list-group-item">
                    <strong>Thời gian nghỉ: </strong>
                    {renderThoiGianNghi(doncho.baolau)}
                  </li>
                </ul>
                <div className="card-body d-flex justify-content-center">
                  <HanhDongDuyet id={doncho.id} hd="dy" />
                  <HanhDongDuyet id={doncho.id} hd="tc" />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-info">
          Hiện không có đơn xin nghỉ nào
        </div>
      )}
      {/* <div className="col-sm-6 mb-4">
        <div className="card">
          <div className="card-body">
            <div className="d-flex align-items-center mb-4">
              <img
                className="border border-mute rounded-circle"
                src="http://localhost:3000/images/no-user.jpg"
                alt="Ảnh nhân viên"
                width="20%"
              />
              <div className="d-lex ml-3 align-items-center">
                <h5 className="card-title mb-1">Trần Trọng Văn</h5>
                <p className="card-text">0314234123</p>
              </div>
            </div>
            <p className="card-text">
              <strong>Lý do nghỉ: </strong> Some quick example text to build on
              the card title and make up the bulk of the card's content.
            </p>
          </div>
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Ngày nghỉ: </strong>Cras justo odio
            </li>
            <li className="list-group-item">
              <strong>Thời gian nghỉ: </strong>Dapibus ac facilisis in
            </li>
          </ul>
          <div className="card-body">
            <button className="btn btn-success card-link">Đồng ý</button>
            <button className="btn btn-danger card-link">Từ chối</button>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default DanhSachCho;
