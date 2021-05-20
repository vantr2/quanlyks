import React, { useContext } from "react";
import { AccountContext } from "../../../contexts/AccountContext";

const Controller = () => {
  const { controllerPhieuXacNhan, setControllerPhieuXacNhan } =
    useContext(AccountContext);
  return (
    <div className="mt-5 mb-4 row">
      <div className="col-3"></div>

      <div className="input-group mb-3 col-6">
        <div className="input-group-prepend">
          <label className="input-group-text" htmlFor="controllerpxn">
            Chọn loại phiếu
          </label>
        </div>
        <select
          className="custom-select"
          id="controllerpxn"
          value={controllerPhieuXacNhan}
          onChange={(e) => setControllerPhieuXacNhan(e.target.value)}
        >
          <option value="dp">Đổi phòng</option>
          <option value="hp">Hủy phòng</option>
        </select>
      </div>
      <div className="col-3"></div>
    </div>
  );
};

export default Controller;
