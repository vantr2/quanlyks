import React, { useEffect, useState } from "react";
import chroma from "chroma-js";
import { useHistory } from "react-router";
import PhongFinder from "../../../apis/PhongFinder";
import Select from "react-select";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";

const DanhSachPhong = () => {
  const [dsPhong, setDsPhong] = useState([]);
  const [timkiem, setTimKiem] = useState({
    value: "%25%25",
    label: "-- Tất cả --",
    color: "#191919",
  });

  const dot = (color = "#ccc") => ({
    alignItems: "center",
    display: "flex",

    ":before": {
      backgroundColor: color,
      borderRadius: 10,
      content: '" "',
      display: "block",
      marginRight: 8,
      height: 10,
      width: 10,
    },
  });

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = chroma(data.color);
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? data.color
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? "#ccc"
          : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
        cursor: isDisabled ? "not-allowed" : "default",

        ":active": {
          ...styles[":active"],
          backgroundColor:
            !isDisabled && (isSelected ? data.color : color.alpha(0.3).css()),
        },
      };
    },
    input: (styles) => ({ ...styles, ...dot() }),
    placeholder: (styles) => ({ ...styles, ...dot() }),
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
  };

  const optionsLocTTP = [
    { value: "%25%25", label: "-- Tất cả --", color: "#191919" },
    { value: "0", label: "Sẵn sàng", color: "#2640eb" },
    { value: "1", label: "Đang được đặt", color: "#24e3dd" },
    { value: "2", label: "Đang sử dụng", color: "#2fed39" },
    { value: "3", label: "Chờ hóa đơn", color: "#b3e33b" },
    { value: "4", label: "Chưa thanh toán", color: "#f5c536" },
  ];

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
      case "5":
        buttonStyle = {
          height: "160px",
          fontSize: "2rem",
          backgroundColor: "#f09e41",
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
        hi.push("/quan-ly/phong/hoa-don");
        break;
      case "4":
        hi.push("/quan-ly/phong/hoa-don");
        // Cho thanh toán
        break;
      case "5":
        // DOn phong
        break;
      default:
        break;
    }
  };
  return (
    <div className="row mt-5">
      <div className="col-12 mb-4">
        <Select
          className="font-werght-bold"
          options={optionsLocTTP}
          value={timkiem}
          onChange={async (value, action) => {
            if (action.action === "select-option") {
              setTimKiem(value);
              const res = await PhongFinder.get(
                `/loc-theo-trang-thai/${value.value}`
              );
              setDsPhong(res.data.data.phong);
            }
          }}
          styles={colourStyles}
        />
      </div>
      {dsPhong.map((phong) => {
        return (
          <div className="col-2 mb-4" key={phong.ten}>
            <ContextMenuTrigger id={phong.ten}>
              <button
                className="btn btn-block"
                style={renderStyle(phong.trangthai)}
                onClick={(e) => handleClick(e, phong.trangthai, phong.ten)}
              >
                {phong.ten}
              </button>
            </ContextMenuTrigger>
            <ContextMenu
              id={phong.ten}
              style={{
                background: "white",
                zIndex: 1,
                padding: "1rem",
                border: "1px solid #191919",
              }}
            >
              <MenuItem data={{ foo: "bar" }}>Rename</MenuItem>
              <MenuItem data={{ foo: "bar" }}>Edit</MenuItem>
              <MenuItem data={{ foo: "bar" }}>Delete</MenuItem>
            </ContextMenu>
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
