import React, { useContext, useEffect } from "react";
import LichSuFinder from "../../../apis/LichSuFinder";
import { AccountContext } from "../../../contexts/AccountContext";
import { NormalizeDate, convertTime } from "../../../utils/DataHandler";
const DanhSachLichSu = () => {
  const { dsLichSu, setDsLichSu } = useContext(AccountContext);

  const userrole = window.localStorage.getItem("user_role");
  const username = window.localStorage.getItem("user_name");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let res;
        if (userrole === "Admin") {
          res = await LichSuFinder.get("/danh-sach");
        } else if (userrole === "QL") {
          res = await LichSuFinder.get("/danh-sach-cap-quan-ly");
        } else {
          res = await LichSuFinder.get(`/danh-sach-theo-nv/${username}`);
        }
        setDsLichSu(res.data.data.lichsu);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsLichSu, username, userrole]);
  return (
    <div className="mt-5">
      {dsLichSu.map((ls) => {
        return (
          <div
            className={
              ls.hanhdong === "Thêm" ||
              ls.hanhdong === "Mở" ||
              ls.hanhdong === "Lập" ||
              ls.hanhdong === "Đồng ý"
                ? "alert alert-primary text-dark"
                : ls.hanhdong === "Sửa"
                ? "alert alert-warning text-dark"
                : ls.hanhdong === "Xóa" ||
                  ls.hanhdong === "Thanh toán" ||
                  ls.hanhdong === "Đổi mật khẩu" ||
                  ls.hanhdong === "Từ chối"
                ? "alert alert-danger text-dark"
                : ls.hanhdong === "Đăng nhập" || ls.hanhdong === "Tăng số lượng"
                ? "alert alert-dark text-dark"
                : ls.hanhdong === "Check In" ||
                  ls.hanhdong === "Check Out" ||
                  ls.hanhdong === "Sử dụng"
                ? "alert alert-info text-dark"
                : ls.hanhdong === "Giảm số lượng" || ls.hanhdong === "Đăng xuất"
                ? "alert alert-secondary text-dark"
                : "alert alert-success text-dark"
            }
            key={ls.id}
          >
            Tài khoản: <strong>{ls.nguoithuchien}</strong>, vào ngày{" "}
            <strong>{NormalizeDate(ls.tdthuchien)}</strong>, lúc{" "}
            <strong>{convertTime(ls.tdthuchien)}</strong>, đã thực hiện{" "}
            <strong>
              {ls.hanhdong} - {ls.doituong}
            </strong>
            <i
              className="far fa-eye text-dark ml-3"
              style={{ cursor: "pointer", float: "right" }}
            ></i>
          </div>
        );
      })}
    </div>
  );
};

export default DanhSachLichSu;
