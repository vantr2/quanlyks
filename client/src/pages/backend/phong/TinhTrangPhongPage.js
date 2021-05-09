import React, { useContext, useEffect } from "react";
import TaiKhoanFinder from "../../../apis/TaiKhoanFinder";
import { AccountContext } from "../../../contexts/AccountContext";

const TinhTrangPhongPage = () => {
  const username = window.localStorage.getItem("user_name");
  const { setUserAvartar } = useContext(AccountContext);
  useEffect(() => {
    const getAvatarNow = async () => {
      const res = await TaiKhoanFinder.get(`/get-avt/${username}`);
      setUserAvartar(res.data.data.nguoidung.avt);
    };
    getAvatarNow();
  }, [setUserAvartar, username]);

  return (
    <div className="mt-5">
      <h1 className="text-center">Tình trạng phòng</h1>
    </div>
  );
};

export default TinhTrangPhongPage;
