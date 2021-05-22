import React, { useContext, useState } from "react";

import { useHistory } from "react-router";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import ThemLichSu from "../../../utils/ThemLichSu";
const XoaTaiSan = ({ id, ts }) => {
  const { setMsgTaiSanActionSuccess, dsTaiSan, setDsTaiSan } =
    useContext(AccountContext);

  let hi = useHistory();
  const [isDel, setIsDel] = useState(false);
  const fetchData = async () => {
    try {
      const res = await TaiSanFinder.get(`/trong-bd-chi-tiet/${ts.id}`);
      if (res.data.data.taisan.count === "0") {
        setIsDel(true);
      } else {
        setIsDel(false);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (isDel) {
      try {
        const res = await TaiSanFinder.delete(`/xoa-tai-san/${ts.id}`);
        //   console.log(res);
        if (res.data === "") {
          ThemLichSu({
            doing: "Xóa",
            olddata: { old: ts },
            newdata: {},
            tbl: "Tài sản",
          });
          setMsgTaiSanActionSuccess("Xóa thành công");
          setTimeout(() => {
            setMsgTaiSanActionSuccess("");
          }, 2000);
          setDsTaiSan(
            dsTaiSan.filter((taisan) => {
              return taisan.id !== id;
            })
          );
          hi.push("/quan-ly/ql-tai-san/thong-tin");
        }
      } catch (err) {
        console.log(err.message);
      }
    } else {
      alert(
        "Dữ liệu tài sản này đang được sử dụng trong bảo dưỡng. Không thể xóa"
      );
    }
  };
  return (
    <div>
      <i
        className="fas fa-trash text-danger"
        data-toggle="modal"
        data-target={`#id${ts.id}xoa`}
        onClick={fetchData}
      >
        &nbsp;Xóa
      </i>

      <div className="modal fade mb-5" id={`id${ts.id}xoa`}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Xác nhận</h4>
              <button type="button" className="close" data-dismiss="modal">
                &times;
              </button>
            </div>

            <div className="modal-body">
              <p className="text-left">
                Bạn có thực sự muốn xóa{" "}
                <span className="font-weight-bold">"{ts.ten}"</span> không ?
              </p>
            </div>

            <div className="modal-footer justify-content-center">
              <button
                type="button"
                className="btn btn-primary font-weight-bold mr-2 px-4"
                data-dismiss="modal"
                onClick={(e) => handleDelete(e)}
              >
                Có
              </button>
              <button
                type="button"
                className="btn btn-secondary font-weight-bold ml-2"
                data-dismiss="modal"
              >
                Không
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XoaTaiSan;
