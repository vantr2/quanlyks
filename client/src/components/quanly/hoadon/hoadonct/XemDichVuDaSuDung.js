import React, { useState } from "react";
import DatPhongFinder from "../../../../apis/DatPhongFinder";
import { NumberFormat } from "../../../../utils/DataHandler";
const XemDichVuDaSuDung = ({ id, phong }) => {
  const [dsDichVu, setDsDichVu] = useState([]);
  const handleClick = async () => {
    try {
      const res = await DatPhongFinder.get(`/danh-sach-dich-vu/${id}`);
      setDsDichVu(res.data.data.datphong_chitiet);
    } catch (er) {
      console.log(er.message);
    }
  };
  return (
    <div>
      <button
        type="button"
        className="btn btn-info ml-2"
        onClick={handleClick}
        data-toggle="modal"
        data-target={`#id${id}xemdv`}
      >
        Xem dịch vụ
      </button>

      <div className="modal fade mb-5" id={`id${id}xemdv`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">
                Danh sách dịch vụ đã sử dụng ở <u>{phong}</u>
              </h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body"></div>
            <table className="table table-hover ">
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th className="text-right">Đơn giá</th>
                  <th className="text-center align-middle">Số lượng</th>
                </tr>
              </thead>
              <tbody>
                {dsDichVu.map((dvsd) => {
                  return (
                    <tr
                      className="border border-left-0 border-right-0 border-top-0 "
                      key={dvsd.id}
                    >
                      <td className="align-middle">{dvsd.dvname}</td>
                      <td className="align-middle text-right">
                        {NumberFormat(dvsd.gia)} VND
                      </td>

                      <td className="align-middle text-center">
                        {dvsd.soluong}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XemDichVuDaSuDung;
