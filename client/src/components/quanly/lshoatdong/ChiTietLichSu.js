import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import LichSuFinder from "../../../apis/LichSuFinder";
import ReactJson from "react-json-view";
const ChiTietLichSu = () => {
  const { id } = useParams();
  let hi = useHistory();
  //   const [dsLs, setDsLs] = useState([]);
  const [oldData, setOldData] = useState("");
  const [newData, setNewData] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await LichSuFinder.get(`/danh-sach/${id}`);
        // setDsLs(res.data.data.lichsu);
        setOldData(JSON.parse(res.data.data.lichsu.dulieucu));
        setNewData(JSON.parse(res.data.data.lichsu.dulieumoi));
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [id]);
  return (
    <div>
      <div className="d-flex flex-row mt-5 justify-content-center">
        <div className="px-4 py-2 border border-secondary mr-2">
          <h5 className="mb-3">Dữ liệu cũ</h5>
          <ReactJson
            src={oldData.old}
            name="old"
            indentWidth="8"
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </div>
        <div className="px-4 py-2 border border-secondary  ">
          <h5 className="mb-3">Dữ liệu mới</h5>
          <ReactJson
            src={newData.new}
            name="new"
            indentWidth="8"
            displayObjectSize={false}
            displayDataTypes={false}
          />
        </div>
      </div>
      <div className="btn btn-secondary" onClick={() => hi.push("/")}>
        Quay lại
      </div>
    </div>
  );
};

export default ChiTietLichSu;
