import React, { useState, useRef } from "react";
import Host from "../../../hosts/Host";
// import LoadDing from "../../../../assets/Load";
const tbody_style = { height: "80em", overflow: "scroll" };
function ThietLapLuongNhanVienTheoThang({ DLLuongNhanVien }) {
  const [DL, SetDL] = React.useState([]);

  // console.log(DL)
  const onClickInLuongNhanVienTheoThang = () => {
    var divToPrint = document.getElementById("ThietLapLuongNhanVien");

    var newWin = window.open("", "Print-Window");

    newWin.document.open();

    newWin.document.write(
      `
        <!doctype html>
        <html lang="en">
          <head>
            <title>Title</title>
            <!-- Required meta tags -->
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        
            <!-- Bootstrap CSS -->
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
            <style>
                #nut-click-ban{
                    display:none;
                }
                .form-control {
                    border: none;
                }
            </style>
            </head>
          <body onload="window.print()">
          ` +
        divToPrint.innerHTML +
        `
            <!-- Optional JavaScript -->
            <!-- jQuery first, then Popper.js, then Bootstrap JS -->
            
          </body>
        </html>`
    );

    newWin.document.close();

    setTimeout(function () {
      newWin.close();
    }, 3000);
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
  };
  const DateInDay = (value) => {
    // console.log(value)
    switch (value) {
      case 1:
        return "Mon";
      case 2:
        return "Tue";
      case 3:
        return "Wed";
      case 4:
        return "Thu";
      case 5:
        return "Fri";
      case 6:
        return "Sat";
      case 0:
        return "Sun";
      default:
        break;
    }
  };
  const typingTimeoutRef = useRef(null);
  //   const [Loader, ShowLoader, HideLoader] = LoadDing();
  const date = new Date();
  const [Thang, SetThang] = useState(date.getMonth() + 1);
  const [Nam, SetNam] = useState(date.getFullYear());
  const [DLNgay, SetDLNgay] = useState([]);
  const [DSNhanVien, SetDSNhanVien] = useState(
    JSON.parse(window.localStorage.getItem("dulieunhanvien"))
  );
  const [TuNgay, SetTuNgay] = useState(1);
  const [DenNgay, SetDenNgay] = useState(daysInMonth(Thang, Nam));
  // const [DLChinhSua,SetDLChinhSua] = useState([])
  const HienThiCacNgayTrongThang = () => {
    return (
      <>
        {DLNgay.map((x) =>
          x >= TuNgay && x <= DenNgay ? (
            <th>{DateInDay(new Date(Nam, Thang - 1, x).getDay()) + "-" + x}</th>
          ) : (
            <></>
          )
        )}
      </>
    );
  };
  const _GioVao = async (x, gio_vao, ngay) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      const DL = [
        {
          ma_nhan_vien: x.ma_nhan_vien,
          name: x.name,
          ngay: ngay,
          gio_vao: gio_vao,
          gio_ra: undefined,
        },
      ];

      alert(JSON.stringify(DL));
      window.localStorage.setItem("DuLieuGioCongNhanVien", JSON.stringify(DL));

      await fetch(Host.ThietLapCaNhanVien, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DL),
      });
    }, 1000);
  };
  const _GioRa = async (x, gio_ra, ngay) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(async () => {
      const DL = [
        {
          ma_nhan_vien: x.ma_nhan_vien,
          name: x.name,
          ngay: ngay,
          gio_vao: undefined,
          gio_ra: gio_ra,
        },
      ];

      alert(JSON.stringify(DL));
      window.localStorage.setItem("DuLieuGioCongNhanVien", JSON.stringify(DL));

      await fetch(Host.ThietLapCaNhanVien, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(DL),
      });
    }, 1000);
  };

  const BangLuongNhanVien = () => {
    try {
      return (
        <>
          {DSNhanVien.map((x) => (
            <tr>
              <td>{x.name}</td>
              {DLNgay.map((y) =>
                y >= TuNgay && y <= DenNgay ? (
                  <>
                    <td>
                      Giờ vào{" "}
                      <input
                        className="form-control"
                        placeholder={DL.map((z) =>
                          z.ma_nhan_vien === x.ma_nhan_vien &&
                          z.ngay === Nam + "-" + Thang + "-" + y
                            ? z.gio_vao
                            : ""
                        )
                          .toString()
                          .split(",")
                          .join("")}
                        onChange={async (e) => {
                          const ngay = Nam + "-" + Thang + "-" + y;
                          const gio_vao = e.target.value;
                          _GioVao(x, gio_vao, ngay);
                        }}
                      ></input>
                      Giờ ra{" "}
                      <input
                        className="form-control"
                        placeholder={DL.map((z) =>
                          z.ma_nhan_vien === x.ma_nhan_vien &&
                          z.ngay === Nam + "-" + Thang + "-" + y
                            ? z.gio_ra
                            : ""
                        )
                          .toString()
                          .split(",")
                          .join("")}
                        onChange={async (e) => {
                          const ngay = Nam + "-" + Thang + "-" + y;
                          const gio_ra = e.target.value;
                          _GioRa(x, gio_ra, ngay);
                        }}
                      ></input>
                    </td>
                  </>
                ) : (
                  <></>
                )
              )}
            </tr>
          ))}
        </>
      );
    } catch (error) {}
  };
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        if (!(DL.length > 0)) {
          // ShowLoader();
        }
        setTimeout(async () => {
          const DLVaoRaNV = [];
          DLLuongNhanVien.map((z) => JSON.parse(z.ca_lam_viec)).map((x) => {
            return DLVaoRaNV.push(x[0]); // them return
          });
          console.log(DLVaoRaNV);
          SetDL(DLVaoRaNV);
          const DL = [];
          for (let i = 1; i <= daysInMonth(Thang, Nam); i++) {
            DL.push(i);
          }
          SetDLNgay(DL);
          // console.log(Host.LayTenNhanVien)
          const response = await fetch(Host.LayTenNhanVien);
          const JsonData = await response.json();
          console.log(JsonData);
          SetDSNhanVien(JsonData);
          window.localStorage.setItem(
            "dulieunhanvien",
            JSON.stringify(JsonData)
          );
          // HideLoader();
        }, 2100);
      } catch (error) {
        //   HideLoader();
      }
    };
    fetchData();
  }, [Thang, Nam, DL, TuNgay, DenNgay, DLLuongNhanVien]);
  return (
    <React.Fragment>
      <div className="content">
        <div className="animated fadeIn">
          <div className="row">
            <div className="col-sm-12">
              <div className="card">
                <div className="card-header">
                  <strong className="card-title">
                    Quản lý lương nhân viên
                  </strong>
                </div>
                <div className="card-body">
                  Tháng
                  <input
                    className="form-control"
                    value={Thang}
                    onChange={(e) => SetThang(e.target.value)}
                    style={{ width: "200px" }}
                  ></input>
                  Năm
                  <input
                    className="form-control"
                    value={Nam}
                    onChange={(e) => SetNam(e.target.value)}
                    style={{ width: "200px" }}
                  ></input>
                  Từ ngày
                  <input
                    className="form-control"
                    value={TuNgay}
                    onChange={(e) => SetTuNgay(e.target.value)}
                    style={{ width: "200px" }}
                  ></input>
                  Đến ngày
                  <input
                    className="form-control"
                    value={DenNgay}
                    onChange={(e) => SetDenNgay(e.target.value)}
                    style={{ width: "200px" }}
                  ></input>
                  <div>
                    <div
                      className="table-responsive mt-5"
                      id="ThietLapLuongNhanVien"
                    >
                      <h3 className="text-center">
                        Lương nhân viên tháng {Thang} - Năm {Nam}
                      </h3>
                      <table className="table table-hover table-inverse mt-3">
                        <thead className="thead-inverse">
                          <tr>
                            <th>Tên nhân viên</th>
                            {HienThiCacNgayTrongThang()}
                          </tr>
                        </thead>
                        <tbody style={tbody_style}>{BangLuongNhanVien()}</tbody>
                      </table>
                    </div>
                  </div>
                  <button
                    className="btn btn-primary"
                    id="nut-click-ban"
                    style={{ float: "right", marginRight: "20px" }}
                    onClick={onClickInLuongNhanVienTheoThang}
                  >
                    In
                  </button>
                </div>
              </div>{" "}
              {/* .card */}
            </div>
            {/*/.col*/}
          </div>
        </div>
        {/* .animated */}
      </div>
      {/* .content */}
      {/* {Loader} */}
    </React.Fragment>
  );
}

export default ThietLapLuongNhanVienTheoThang;
