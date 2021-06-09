import React from "react";
import { useHistory, useParams } from "react-router";
import PhongFinder from "../../../apis/PhongFinder";

const DonPhong = () => {
  const { phongid } = useParams();
  let hi = useHistory();
  return (
    <div>
      <p>Phòng {phongid} đang được dọn....</p>
      <button
        type="button"
        className="btn btn-primary"
        onClick={async () => {
          await PhongFinder.put("/update-tt", {
            ten: phongid,
            trangthai: 0,
          });
          hi.push("/quan-ly/phong/tinh-trang");
        }}
      >
        Dọn xong
      </button>
    </div>
  );
};

export default DonPhong;
