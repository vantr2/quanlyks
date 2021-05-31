import React, { useContext, useEffect, useState } from "react";
import DichVuFinder from "../../../apis/DichVuFinder";
import DatPhongFinder from "../../../apis/DatPhongFinder";
import {
  convertTime,
  NumberFormat,
  NormalizeDate,
} from "../../../utils/DataHandler";
import { useParams, useHistory } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import XemThanhToan from "./XemThanhToan";
import CheckOut from "./CheckOut";
import ThemLichSu from "../../../utils/ThemLichSu";
const SuDungDichVu = () => {
  const [ldvIdSelected, setLdvIdSelected] = useState("");

  let hi = useHistory();
  const [dsDichVu, setDsDichVu] = useState([]);
  const [dsLoaiDv, setDsLoaiDv] = useState([]);
  const [dpSelected, setDpSelected] = useState([]);

  const { dsDvSuDung, setDsDvSuDung, themDvSd } = useContext(AccountContext);

  //   const [msgSuccess, setMsgSuccess] = useState("");
  const [khName, setKhName] = useState("");
  const [khSdt, setKhSdt] = useState("");
  const { phongid } = useParams();

  const getDichVu = async () => {
    try {
      const res = await DichVuFinder.get("/danh-sach-dich-vu");
      setDsDichVu(res.data.data.dichvu);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getLoaiDichVu = async () => {
    try {
      const res = await DichVuFinder.get("/danh-sach-loai-dich-vu");
      setDsLoaiDv(res.data.data.loaidv);
    } catch (err) {
      console.log(err.message);
    }
  };
  useEffect(() => {
    const getDatPhong = async () => {
      try {
        const res = await DatPhongFinder.get(`/danh-sach/${phongid}`);
        if (res.data.status === "ok") {
          setDpSelected(res.data.data.datphong);
          setKhName(res.data.data.datphong.kh_name);
          setKhSdt(res.data.data.datphong.kh_sdt);
          const res2 = await DatPhongFinder.get(
            `/danh-sach-dich-vu/${res.data.data.datphong.id}`
          );
          setDsDvSuDung(res2.data.data.datphong_chitiet);
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    getDatPhong();
    getDichVu();
    getLoaiDichVu();
  }, [setDsDichVu, setDsLoaiDv, phongid, setDpSelected, setDsDvSuDung]);

  const handleChangeLDVFilter = async (e) => {
    setLdvIdSelected(e.target.value);
    if (e.target.value) {
      try {
        const res = await DichVuFinder.get(`/loc-theo-loai/${e.target.value}`);
        setDsDichVu(res.data.data.loaidv);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      getDichVu();
    }
  };

  const handleClickImg = async (e, dv) => {
    e.stopPropagation();
    try {
      const res = await DatPhongFinder.post("/them-chi-tiet", {
        datphong_id: dpSelected.id,
        dichvu_id: dv.id,
        gia: dv.giahientai,
        thanhtien: parseInt(dv.giahientai),
      });
      if (res.data.status === "ok") {
        ThemLichSu({
          doing: "Sử dụng",
          olddata: {},
          newdata: { new: res.data.data.datphong_chitiet },
          tbl: "Dịch vụ",
        });
        // setMsgSuccess("Thêm thành công");
        // setTimeout(() => {
        //   setMsgSuccess("");
        // }, 2000);
        const res_dpchitiet = await DatPhongFinder.get(
          `/danh-sach-dich-vu-theo-id/${res.data.data.datphong_chitiet.id}`
        );

        themDvSd(res_dpchitiet.data.data.datphong_chitiet);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const goBack = () => {
    hi.push("/quan-ly/phong/tinh-trang");
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await DatPhongFinder.delete(`/xoa-chi-tiet/${id}`);
      setDsDvSuDung(
        dsDvSuDung.filter((dv) => {
          return dv.id !== id;
        })
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      {" "}
      <h2 className="text-center">Sử dụng dịch vụ phòng {phongid}</h2>
      <div className="text-center">
        <u>
          Khách hàng: {khName} - {khSdt}
        </u>
      </div>
      <div className="row mt-5">
        <div className="col-6 border border-dark">
          <div style={{ height: "550px", overflow: "auto" }}>
            {/* Tìm kiếm */}
            <div className="input-group mb-4 mt-3">
              <div className="input-group-prepend">
                <span className="input-group-text" id="locdv">
                  <i className="fas fa-search text-primary"></i>
                </span>
              </div>
              <select
                className="custom-select"
                id="locdv"
                value={ldvIdSelected}
                onChange={(e) => handleChangeLDVFilter(e)}
              >
                <option value="">Tất cả ...</option>
                {dsLoaiDv.map((ldv) => {
                  return (
                    <option value={ldv.id} key={ldv.id}>
                      {ldv.name}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* <p className="text-success">{msgSuccess}</p> */}
            {/* Danh sách dịch vụ */}
            <div className="row mt-3 ">
              {dsDichVu.map((dv) => {
                return (
                  <div className="col-3" key={dv.id}>
                    <img
                      src={dv.anhminhhoa}
                      alt="Ảnh dịch vụ"
                      width="112px"
                      onClick={(e) => handleClickImg(e, dv)}
                    />
                    <p
                      className="text-center"
                      style={{
                        fontSize: "0.8rem",
                        marginBottom: "0px",
                      }}
                    >
                      {dv.ten}
                    </p>
                    <p
                      className="text-danger text-center"
                      style={{ fontSize: "0.6rem" }}
                    >
                      Giá : {NumberFormat(dv.giahientai)} VND
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="col-6 p-0 border border-left-0 border-dark">
          <div style={{ height: "555px", overflow: "auto" }}>
            <table className="table table-hover  ">
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Đơn giá</th>
                  <th>Ngày sử dụng</th>
                  <th>Xóa</th>
                </tr>
              </thead>
              <tbody>
                {dsDvSuDung.map((dvsd) => {
                  return (
                    <tr
                      className="border border-left-0 border-right-0 border-top-0 "
                      key={dvsd.id}
                    >
                      <td className="align-middle">{dvsd.dvname}</td>
                      <td className="align-middle ">
                        <strong>{NumberFormat(dvsd.gia)}</strong> VND
                      </td>
                      <td className="align-middle ">
                        {NormalizeDate(dvsd.ngaysd)}&nbsp;
                        {convertTime(dvsd.ngaysd)}
                      </td>
                      <td style={{ cursor: "pointer" }}>
                        <i
                          className="fas fa-trash text-danger"
                          onClick={(e) => handleDelete(e, dvsd.id)}
                        >
                          &nbsp;Xóa
                        </i>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="d-flex flex-row mb-5 pt-4 justify-content-center">
        <CheckOut phongid={phongid} />
        <XemThanhToan phongid={phongid} />
        <button
          type="button"
          className="btn btn-secondary px-5"
          onClick={goBack}
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default SuDungDichVu;
