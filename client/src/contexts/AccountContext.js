import React, { useState, createContext } from "react";

export const AccountContext = createContext();
export const AccountContextProvider = (props) => {
  //dang nhap
  const [signedIn, setSignedIn] = useState(
    window.localStorage.getItem("dangnhap")
  );

  const [tenDangNhap, setTenDangNhap] = useState(
    window.localStorage.getItem("user_name")
  );

  const [userDisplayName, setUserDisplayName] = useState(
    window.localStorage.getItem("user_displayname")
  );

  const [userRole, setUserRole] = useState(
    false || window.localStorage.getItem("user_role")
  );

  const [userAvatar, setUserAvartar] = useState(
    window.localStorage.getItem("user_avt")
  );

  const [userId, setUserId] = useState(window.localStorage.getItem("user_id"));

  // nguoi dung
  const [nguoiDungList, setNguoiDungList] = useState([]);
  const themNguoiDung = (nguoidung) => {
    setNguoiDungList([...nguoiDungList, nguoidung]);
  };

  const [msgUserActionSuccess, setMsgUserActionSuccess] = useState("");

  // nhan vien

  const [dsNhanVien, setDsNhanVien] = useState([]);
  const themNhanVien = (nhanvien) => {
    setDsNhanVien([...dsNhanVien, nhanvien]);
  };

  const [msgNhanVienActionSuccess, setMsgNhanVienActionSuccess] = useState("");

  //// nhan vien

  const [dsPhong, setDsPhong] = useState([]);
  const themPhong = (phong) => {
    setDsPhong([...dsPhong, phong]);
  };

  const [msgPhongActionSuccess, setMsgPhongActionSuccess] = useState("");

  // dich vu
  const [dsDichVu, setDsDichVu] = useState([]);
  const themDichVu = (dichvu) => {
    setDsDichVu([...dsDichVu, dichvu]);
  };

  const [msgDichVuActionSuccess, setMsgDichVuActionSuccess] = useState("");

  // tai san
  const [dsTaiSan, setDsTaiSan] = useState([]);
  const themTaiSan = (taisan) => {
    setDsTaiSan([...dsTaiSan, taisan]);
  };

  const [msgTaiSanActionSuccess, setMsgTaiSanActionSuccess] = useState("");

  // bao duong
  const [dsBaoDuong, setDsBaoDuong] = useState([]);
  const themBaoDuong = (baoduong) => {
    setDsBaoDuong([...dsBaoDuong, baoduong]);
  };
  const [dsBaoDuongChiTiet, setDsBaoDuongChiTiet] = useState([]);
  const themBaoDuongChiTiet = (baoduongchitiet) => {
    setDsBaoDuongChiTiet([...dsBaoDuongChiTiet, baoduongchitiet]);
  };
  const [msgErrorBDCT, setMsgErrorBDCT] = useState("");
  const [msgBaoDuongActionSuccess, setMsgBaoDuongActionSuccess] = useState("");

  // nha cung cap
  const [dsNcc, setDsNcc] = useState([]);
  const themNcc = (ncc) => {
    setDsNcc([...dsNcc, ncc]);
  };

  const [msgNccActionSuccess, setMsgNccActionSuccess] = useState("");

  // nhan vien xin nghi

  const [dsDon, setDsDon] = useState([]);
  const themDon = (don) => {
    setDsDon([...dsDon, don]);
  };

  const [msgDonActionSuccess, setMsgDonActionSuccess] = useState("");

  return (
    <AccountContext.Provider
      value={{
        //đang nhập
        signedIn,
        setSignedIn,
        tenDangNhap,
        setTenDangNhap,
        userDisplayName,
        setUserDisplayName,
        userRole,
        setUserRole,
        userId,
        setUserId,
        userAvatar,
        setUserAvartar,

        //ql nguoi dung
        nguoiDungList,
        setNguoiDungList,
        themNguoiDung,
        msgUserActionSuccess,
        setMsgUserActionSuccess,

        //quan ly nhan vien
        dsNhanVien,
        themNhanVien,
        setDsNhanVien,
        msgNhanVienActionSuccess,
        setMsgNhanVienActionSuccess,

        // quan ly thong tin phong,
        dsPhong,
        themPhong,
        setDsPhong,
        msgPhongActionSuccess,
        setMsgPhongActionSuccess,

        //quan ly dich vu
        dsDichVu,
        setDsDichVu,
        themDichVu,
        msgDichVuActionSuccess,
        setMsgDichVuActionSuccess,

        //quan ly tai san
        dsTaiSan,
        themTaiSan,
        setDsTaiSan,
        msgTaiSanActionSuccess,
        setMsgTaiSanActionSuccess,

        // tai san bao duong
        msgBaoDuongActionSuccess,
        setMsgBaoDuongActionSuccess,
        dsBaoDuong,
        setDsBaoDuong,
        themBaoDuong,
        dsBaoDuongChiTiet,
        setDsBaoDuongChiTiet,
        themBaoDuongChiTiet,
        msgErrorBDCT,
        setMsgErrorBDCT,

        // nha cung cap
        msgNccActionSuccess,
        setMsgNccActionSuccess,
        dsNcc,
        setDsNcc,
        themNcc,

        // nhan vien xin nghi
        msgDonActionSuccess,
        setMsgDonActionSuccess,
        dsDon,
        setDsDon,
        themDon,
      }}
    >
      {props.children}
    </AccountContext.Provider>
  );
};
