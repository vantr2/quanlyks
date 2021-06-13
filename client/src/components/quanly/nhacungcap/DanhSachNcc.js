import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import NhaCungCapFinder from "../../../apis/NhaCungCapFinder";
import XoaNcc from "./XoaNcc";
import SuaNcc from "./SuaNcc";
import { CSVLink } from "react-csv";

const DanhSachNcc = () => {
  const [dataTable, setDataTable] = useState([]);
  const { dsNcc, setDsNcc, msgNccActionSuccess } = useContext(AccountContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NhaCungCapFinder.get("/danh-sach-nha-cung-cap");
        if (res.data.status === "ok") {
          setDsNcc(res.data.data.nhacungcap);
          setDataTable(res.data.data.nhacungcap);
        }
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsNcc]);

  const headers = [
    { label: "Mã nhà cung cấp", key: "id" },
    { label: "Tên nhà cung cấp", key: "ten" },
    { label: "Số điện thoại", key: "sdt" },
    { label: "Địa chỉ", key: "diachi" },
  ];

  return (
    <div>
      {" "}
      <div className="mt-5 mb-5">
        <p className="text-center text-success">{msgNccActionSuccess}</p>
        <table className="table table-hover table-striped table-bordered ">
          <thead className="thead-dark text-center">
            <tr>
              <th>Mã nhà cung cấp</th>
              <th>Tên nhà cung cấp</th>
              <th>Địa chỉ</th>
              <th>Số điện thoại</th>
              <th>Sửa</th>
              <th>Xóa</th>
            </tr>
          </thead>
          <tbody>
            {dsNcc.map((ncc) => {
              return (
                <tr key={ncc.id} className="text-center">
                  <td className="align-middle">{ncc.id}</td>
                  <td className="align-middle">{ncc.ten}</td>
                  <td className="align-middle">{ncc.diachi}</td>
                  <td className="align-middle">{ncc.sdt}</td>

                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <SuaNcc id={ncc.id} />
                  </td>
                  <td
                    className="align-middle text-center"
                    style={{ cursor: "pointer" }}
                  >
                    <XoaNcc ncc={ncc} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <CSVLink
        data={dataTable}
        headers={headers}
        className="btn btn-primary"
        filename={`nhacungcap-${new Date().toLocaleDateString("vi-VN")}.csv`}
      >
        Download me
      </CSVLink>
    </div>
  );
};

export default DanhSachNcc;
