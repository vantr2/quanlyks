import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import PhongFinder from "../../../apis/PhongFinder";

const DanhSachPhong = () => {
  const [dsPhong, setDsPhong] = useState([]);
  let hi = useHistory();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await PhongFinder.get("/danh-sach-phong");
        setDsPhong(res.data.data.phong);
        // console.log(res);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, [setDsPhong]);

  const renderStyle = (tt) => {
    let buttonStyle;
    switch (tt + "") {
      case "0":
        buttonStyle = {
          height: "160px",
          fontSize: "2rem",
          backgroundColor: "#2640eb",
        };
        break;
      case "1":
        buttonStyle = {
          height: "160px",
          fontSize: "2rem",
          backgroundColor: "#24e3dd",
        };
        break;
      case "2":
        buttonStyle = {
          height: "160px",
          fontSize: "2rem",
          backgroundColor: "#2fed39",
        };
        break;
      case "3":
        buttonStyle = {
          height: "160px",
          fontSize: "2rem",
          backgroundColor: "#b3e33b",
        };
        break;
      case "4":
        buttonStyle = {
          height: "160px",
          fontSize: "2rem",
          backgroundColor: "#f5c536",
        };
        break;
      default:
        break;
    }
    return buttonStyle;
  };

  const handleClick = (e, tt, phongid) => {
    e.stopPropagation();
    switch (tt + "") {
      case "0":
        //   Mo phong
        hi.push(`/quan-ly/phong/tinh-trang/${phongid}/mophong`);
        break;
      case "1":
        // Check iN
        hi.push(`/quan-ly/phong/tinh-trang/${phongid}/checkin`);
        break;
      case "2":
        //Sd dich vu - check out
        hi.push(`/quan-ly/phong/tinh-trang/${phongid}/su-dung-dich-vu`);
        break;
      case "3":
        // Lap hoa don

        break;
      case "4":
        //Don phong
        break;
      default:
        break;
    }
  };
  return (
    <div className="row mt-5">
      {dsPhong.map((phong) => {
        return (
          <div className="col-2 mb-4" key={phong.ten}>
            <button
              className="btn btn-block"
              style={renderStyle(phong.trangthai)}
              onClick={(e) => handleClick(e, phong.trangthai, phong.ten)}
            >
              {phong.ten}
            </button>
          </div>
        );
      })}
      {/* <div className="col-3 mb-4">
        <button
          className="btn btn-warning btn-block"
          style={{ height: "160px", fontSize: "2rem" }}
        >
          AA
        </button>
      </div> */}
    </div>
  );
};

export default DanhSachPhong;
