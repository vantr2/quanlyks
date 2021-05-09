import React, { useContext, useEffect, useState } from "react";
import { AccountContext } from "../../../contexts/AccountContext";
import BaoDuongFinder from "../../../apis/BaoDuongFinder";
import TaiSanFinder from "../../../apis/TaiSanFinder";
import { useParams, useHistory } from "react-router";
import CurrencyInput from "react-currency-input-field";
const ThemTaiSanBaoDuong = () => {
  const [phibd, setPhiBd] = useState("");
  const [ghichu, setGhiChu] = useState("");
  const [idTS, setIdTS] = useState("--Chọn--");
  const [tents, setTenTs] = useState("");

  const [taisanFilter, setTaiSanFilter] = useState([]);

  const { themBaoDuongChiTiet } = useContext(AccountContext);
  const [msgError, setMsgError] = useState("");

  const { id } = useParams();
  let hi = useHistory();
  useEffect(() => {
    const filterTaiSan = async () => {
      try {
        const res = await TaiSanFinder.get("/danh-sach-tai-san");
        setTaiSanFilter(res.data.data.taisan);
      } catch (err) {
        console.log(err.message);
      }
    };
    filterTaiSan();
  }, [setTaiSanFilter]);

  const handleSubmit = async () => {
    if (idTS === "--Chọn--") {
      setMsgError("Bạn cần phải chọn tài sản.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!phibd) {
      setMsgError("Phí bảo dưỡng không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else if (!ghichu) {
      setMsgError("Ghi chú không được để trống.");
      setTimeout(() => {
        setMsgError("");
      }, 3000);
    } else {
      try {
        const res = await BaoDuongFinder.post("/them-chi-tiet", {
          taisanbd: idTS,
          phibd: phibd,
          ghichu: ghichu,
          baoduong_id: id,
        });

        if (res.data.status === "ok") {
          const bdchitetInserted = res.data.data.baoduong_chitiet;
          const bdchitietContext = {
            id: bdchitetInserted.id,
            phibd: bdchitetInserted.phibd,
            ghichu: bdchitetInserted.ghichu,
            baoduong_id: bdchitetInserted.baoduong_id,
            taisanbd: bdchitetInserted.taisanbd,
            ten: tents,
          };
          themBaoDuongChiTiet(bdchitietContext);
          setTaiSanFilter(
            taisanFilter.filter((taisan) => {
              return taisan.id !== bdchitetInserted.taisanbd;
            })
          );
          setGhiChu("");
          setIdTS("--Chọn--");
          setPhiBd("");
          hi.push("/quan-ly/ql-tai-san/bao-duong");
          hi.push(`/quan-ly/ql-tai-san/bao-duong/${id}`);
        } else {
          setMsgError(res.data.status);
          setTimeout(() => {
            setMsgError("");
          }, 3000);
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  };
  return (
    <div>
      <div className="mt-5 mb-2 ">
        <div id="thembaoduongchitiet">
          <div className="card">
            <div className="card-header" id="baoduongchitietcard">
              <h5 className="mb-0">
                <div
                  className="text-primary collapsed"
                  data-toggle="collapse"
                  data-target="#formthembaoduongchitiet"
                  aria-expanded="false"
                  aria-controls="formthembaoduongchitiet"
                  style={{ cursor: "pointer" }}
                >
                  Thêm tài sản được bảo dưỡng
                </div>
              </h5>
            </div>
            <div
              id="formthembaoduongchitiet"
              className="collapse"
              aria-labelledby="baoduongchitietcard"
              data-parent="#thembaoduongchitiet"
            >
              <div className="card-body px-5">
                <form action="">
                  <div className="form-row">
                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="taisanbd">Tài sản bảo dưỡng</label>
                        <select
                          onChange={(e) => {
                            setIdTS(e.target.value);
                            let index = e.nativeEvent.target.selectedIndex;
                            setTenTs(e.nativeEvent.target[index].text);
                          }}
                          value={idTS}
                          id="taisanbd"
                          className="form-control"
                        >
                          <option value="--Chọn--" disabled>
                            -- Chọn --
                          </option>
                          {taisanFilter.map((taisan) => {
                            return (
                              <option key={taisan.id} value={taisan.id}>
                                {taisan.ten}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>

                    <div className="col">
                      <div className="form-group">
                        <label htmlFor="phibd">Phí bảo dưỡng</label>
                        <CurrencyInput
                          id="phibd"
                          value={phibd}
                          className="form-control text-right"
                          suffix=" đồng"
                          groupSeparator="."
                          onValueChange={(value) => {
                            setPhiBd(value);
                          }}
                          step="1000"
                          maxLength="9"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="ghichu">Ghi chú</label>
                    <textarea
                      className="form-control"
                      id="ghichu"
                      rows="2"
                      value={ghichu}
                      onChange={(e) => setGhiChu(e.target.value)}
                    ></textarea>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary py-2 px-4"
                    onClick={handleSubmit}
                  >
                    Thêm
                  </button>
                  <p className="text-danger my-2">{msgError}</p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemTaiSanBaoDuong;
