import React, { useContext, useEffect, useState } from "react";
import XinNghiFinder from "../../../apis/XinNghiFinder";
import { useHistory, useParams } from "react-router";
import { AccountContext } from "../../../contexts/AccountContext";
import { dateInPast, convertDate } from "../../../utils/DataHandler";
const SuaXinNghi = () => {
  let hi = useHistory();
  const { id } = useParams();
  const [khinao, setKhiNao] = useState("");
  const [baolau, setBaoLau] = useState("");
  const [lydo, setLyDo] = useState("");
  const { setMsgDonActionSuccess } = useContext(AccountContext);
  const [msgError, setMsgError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await XinNghiFinder.get(`/danh-sach-full-theo-id/${id}`);
        const donSelected = res.data.data.xinnghi;
        setKhiNao(convertDate(donSelected.khinao));
        console.log(convertDate(donSelected.khinao));
        setBaoLau(donSelected.baolau);
        setLyDo(donSelected.lydo);
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [id]);

  const goBack = () => {
    hi.push(`/quan-ly/nhan-vien/xin-nghi/${id}`);
  };

  const handleUpdate = async () => {
    if (!khinao) {
      setMsgError("Ngày nghỉ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (dateInPast(new Date(khinao), new Date())) {
      setMsgError("Bạn phải chọn ngày nghỉ sau ngày hôm nay.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!lydo) {
      setMsgError("Lý do nghỉ không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await XinNghiFinder.put("/sua", {
          id,
          khinao,
          baolau,
          lydo,
        });
        if (res.data.status === "ok") {
          setMsgDonActionSuccess("Sửa thành công.");
          setTimeout(() => {
            setMsgDonActionSuccess("");
          }, 2500);
          hi.push(`/quan-ly/nhan-vien/xin-nghi/${id}`);
        } else {
          setMsgDonActionSuccess(res.data.status);
          setTimeout(() => {
            setMsgDonActionSuccess("");
          }, 2500);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  return (
    <div className="container mt-5">
      <form action="">
        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label htmlFor="khinaonghi">Khi nào nghỉ</label>
              <input
                type="date"
                id="khinaonghi"
                className="form-control"
                onChange={(e) => setKhiNao(e.target.value)}
                value={khinao}
              />
            </div>
          </div>

          <div className="col">
            <div className="form-group">
              <label htmlFor="nghibaolau">Nghỉ bao lâu</label>
              <select
                onChange={(e) => setBaoLau(e.target.value)}
                value={baolau}
                id="nghibaolau"
                className="form-control"
              >
                <option value="--Chọn--" disabled>
                  -- Chọn --
                </option>
                <option value="0">Nửa ngày</option>
                <option value="1">Một ngày</option>
                <option value="2">Một ngày rưỡi</option>
                <option value="3">Hai ngày</option>
              </select>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="lydonghi">Lý do nghỉ</label>
          <textarea
            id=""
            rows="4"
            className="form-control"
            value={lydo}
            onChange={(e) => setLyDo(e.target.value)}
          ></textarea>
        </div>
        <p className="text-danger my-2">{msgError}</p>

        <div className="d-flex flex-row">
          <button
            className="btn btn-warning px-4"
            type="button"
            onClick={handleUpdate}
          >
            Sửa
          </button>
          <button className="btn btn-primary ml-3" onClick={goBack}>
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );
};

export default SuaXinNghi;
