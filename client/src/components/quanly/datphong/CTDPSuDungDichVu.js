import React, { useState } from "react";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import {
  convertTime,
  NormalizeDate,
  NumberFormat,
} from "../../../utils/DataHandler";
const CTDPSuDungDichVu = ({ id }) => {
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
        className="btn btn-info px-4"
        type="button"
        onClick={handleClick}
        data-toggle="modal"
        data-target={`#id${id}xemdv`}
      >
        Dịch vụ
      </button>

      <div className="modal fade mb-5" id={`id${id}xemdv`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Danh sách dịch vụ đã sử dụng</h4>
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
                  <th className="text-center align-middle">Ngày sử dụng</th>
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
                        {NormalizeDate(dvsd.ngaysd)}&nbsp;
                        {convertTime(dvsd.ngaysd)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
                data-dismiss="modal"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTDPSuDungDichVu;
