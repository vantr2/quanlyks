import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import NhanVienFinder from "../../../apis/NhanVienFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const XoaNhanVien = () => {
  const { id } = useParams();
  const [tenNV, setTenNV] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await NhanVienFinder.get(`/danh-sach-nhan-vien/${id}`);
        setTenNV(res.data.data.nhanvien.name);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setTenNV, id]);

  const { setMsgNhanVienActionSuccess, dsNhanVien, setDsNhanVien } = useContext(
    AccountContext
  );
  let hi = useHistory();
  const handleDelete = async (e) => {
    e.stopPropagation();
    try {
      const res = await NhanVienFinder.delete(`/xoa-nhan-vien/${id}`);
      //   console.log(res);
      if (res.data === "") {
        setMsgNhanVienActionSuccess("Xóa thành công");
        setTimeout(() => {
          setMsgNhanVienActionSuccess("");
        }, 2000);
        setDsNhanVien(
          dsNhanVien.filter((nhanvien) => {
            return nhanvien.id !== id;
          })
        );
        hi.push("/quan-ly/danh-muc/nhan-vien");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <button
        className="btn btn-danger px-4"
        type="button"
        data-toggle="modal"
        data-target={`#id${id}xoa`}
      >
        Xóa
      </button>

      <div className="modal fade mb-5" id={`id${id}xoa`}>
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
                <span className="font-weight-bold">"{tenNV}"</span> không ?
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

export default XoaNhanVien;
